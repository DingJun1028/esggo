param(
  [array]$Ports = @(8642,8644,3000,8787,8788,6379,8645,3001)
)
foreach($p in $Ports){
  $c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
  if($c){
    Write-Output ("LISTENING port={0} pid={1} addr={2}" -f $p, $c.OwningProcess, $c.LocalAddress)
  } else {
    Write-Output ("NO_LISTENER port={0}" -f $p)
  }
}
Write-Output "PS_PORT_CHECK_DONE"
