
<?php

$appname = $_GET['appname'];
$profilename = $_GET['profilename'];

// 受け取った profilename と appname からローカルのxmlのパスを取得
$steamAchievementXMLUrl = '../xml/' . $appname . '_' .$profilename . '.xml';

// 削除
// 出力
echo unlink($steamAchievementXMLUrl);

?>
