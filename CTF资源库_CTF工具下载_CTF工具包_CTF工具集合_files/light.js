function switchTab(tabid)
{
if(tabid == '') return false;
for(var i=0;i<=15;i++)
{
	if(tabid == 't_'+i) document.getElementById(tabid).style.color="red";
	else document.getElementById('t_'+i).style.color="#06c1ae";
}
return true;
}