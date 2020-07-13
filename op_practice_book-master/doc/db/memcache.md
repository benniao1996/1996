## MemCache

<!-- vim-markdown-toc GFM -->

* [1 Memcache 使用](#1-memcache-使用)
    * [1.1 telnet 访问](#11-telnet-访问)
        * [telnet 写请求命令格式](#telnet-写请求命令格式)
        * [telnet 读请求](#telnet-读请求)
* [2 Case](#2-case)
    * [2.1 MemCache 访问热点导致服务雪崩 case](#21-memcache-访问热点导致服务雪崩-case)
    * [2.2 那我们如何防止这样的事故发生](#22-那我们如何防止这样的事故发生)
        * [明确使用场景，防止滥用](#明确使用场景防止滥用)
        * [不人为制造访问热点](#不人为制造访问热点)
        * [实例拆分](#实例拆分)

<!-- vim-markdown-toc -->
## 1 Memcache 使用

### 1.1 telnet 访问
#### telnet 写请求命令格式
```
<Command name> <key> <flags> <exptime> <bytes>\r\n
<data block> \r\n

简单解释
<Command name>：可以是 add，set，replace 等
<key>：为 memcache key 键的名称，要求唯一
<flags>：是一个 16 位的无符号整数（10 进制），该标志和需要存储的数据一起存储，并在客户端 get 数据时返回。客户可以将此标志用做特殊用途，此标志对服务器来说是透明的。
<exptime>：过期的时间，单位为秒，设置为 0 表示永不过期。
<bytes>：需要存储的字节数（不包含最后的“\r\n ”），可以为 0，表示空数据。
\r\n：命令结尾标识符，在 telnet 界面输入命令时按回车键即可。
<data block>：表示存储的数据内容，即 value。
```

telnet 写命令响应

> * Stored 表示存储成功
> * not_stored：表示存储失败（命令正确，但操作不对）
> * Error：表示命令错误

#### telnet 读请求

```
get key
```
## 2 Case
### 2.1 MemCache 访问热点导致服务雪崩 case

15 年，某产品线发生了一起严重的丢失用户流量的事故，就这个 case 来谈谈 MemCache 使用不当的问题。

他们的使用方法是这样的，在站点的主页上每次请求会首先请求一个单热点 key，value 大概在 250 KB 左右。

以千兆网卡的容量计算，热点机器网卡容量极限为 400 QPS。若请求失败（cache 失效、访问超时等），PHP 会根据业务逻辑，再请求大约 600 个 cache 数据。

然后重新构造首页的数据块。

在当天下午 14 ~ 15 点左右，用户流量有自然增长，超过了 400 QPS，于是那台热点的机器单机网卡打满，大批量的首页请求获取热点 cache 失败。

PHP 业务为了重新构造数据块，另外请求 600 个 key，导致所有的 cache 机器请求都上涨，网卡占用上涨。同时，由于请求 600 多次 cache 需要耗时过长，产生了很多的长耗时请求，这些请求占用 dbproxy 连接不释放，导致 DB 的连接数也打满。

此时，其他请求大量失败，因此对于 memcache 调用减少，但是还是有相当量的首页请求仍然在请求单热点，导致单热点网卡依然处于打满情况，其他机器网卡有所下降。此时产品线无法提供正常服务，处于挂站状态。

### 2.2 那我们如何防止这样的事故发生

#### 明确使用场景，防止滥用

首先要确定一个需求是不是适合用 cache。大多数场景下，cache 里存储的都是几百个字节的小数据（如帖子列表、用户信息、图片元信息等），复杂的结构数据序列化之后一般也不会超过 2 KB。250 KB 的大数据块，如果是图片，应该塞到图片存储系统；如果是整个网页，那么展示时“实时渲染 VS 直接从 cache 取”这两种方案，还需商榷。

#### 不人为制造访问热点

Memcache 的访问本身就具有一定的热点（比如某些书看的人多、一段时间内的热门话题等），在实际工程中，这些热点也是需要尽量被平均的。然而在这个 case 中，人为制造了热点，即，对同一个 key 的访问在每一个请求的关键路径上，这是一定需要避免的。

#### 实例拆分

多个业务（如主页和文章列表等）使用同一个 Memcache 实例，某一个业务流量飙升（正常增长或隐藏的 bug 导致流量异常）就会导致其它所有的业务访问受影响，一挂挂全站。这时需要把比较重要的服务依赖的 cache 拆分成单独的实例，尽量减少互相影响，提升可用性。