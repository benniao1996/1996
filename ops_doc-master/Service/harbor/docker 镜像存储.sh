docker 存储

结合不同场景选择适合的存储模型，讲解每种存储模型选择的软件，以及匹配的业务种类；对比测试不同存储的性能（顺序读写，乱序读写）

对象存储 OSS 是否既可以满足当前所有业务需求
块存存储 Ceph 等开源软件调研
文件存储

nfs取消，用oss存储
磁盘挂载，换了docker，其他docker如何挂载
多份
mq，redis这种，需要磁盘的如何挂载

ksCZXKtisT8z7i




docker CE





harbor.sa.gotokeep.com
admin/Harbor12345



docker login -u admin -p Harbor12345 10.24.160.232

docker tag nginx:1.11.5 10.24.160.232/library/nginx:1.11.5
docker push  10.24.160.232/library/nginx
docker pull 10.24.160.232/library/nginx:1.11.5






docker login -u admin -p Harbor12345 p-harbor-01

docker tag nginx:1.11.5 p-harbor-01/library/nginx:1.11.5
docker push  p-harbor-01/library/nginx
docker pull p-harbor-01/library/nginx:1.11.5


p-harbor-01

/data/init/set-dns.sh p-harbor-01.ali.keep 10.24.160.232



harbor.svc.ali.keep

/data/init/set-dns.sh harbor.svc.ali.keep 10.24.160.232


#配置后端存储
vim common/templates/registry/config.yml

    oss:
        accesskeyid: LTjc51L
        accesskeysecret: tKUWoKhTs2AVLyDAlw
        region: oss-cn-beijing
        endpoint: harbor.vpc100-oss-cn-beijing.aliyuncs.com
        bucket: harbor
        secure: false
        internal: true


    oss:
        accesskeyid: LTAIFPNBSf2cCKIP
        accesskeysecret: A3kcC62C82ixnIxiINRvZ3QGk5ltck
        region: oss-cn-beijing
        endpoint: keep-harbor.oss-cn-beijing-internal.aliyuncs.com
        bucket: keep-harbor
        secure: false
        internal: true




LTAIFPNBSf2cCKIP
A3kcC62C82ixnIxiINRvZ3QGk5ltck



auth = oss2.Auth('LTAIFPNBSf2cCKIP', 'A3kcC62C82ixnIxiINRvZ3QGk5ltck')
service = oss2.Service(auth, 'oss-cn-beijing-internal.aliyuncs.com')

print([b.name for b in oss2.BucketIterator(service)])







