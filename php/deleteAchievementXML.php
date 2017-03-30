
<?php

$appname = $_GET['appname'];
$profilename = $_GET['profilename'];

if (!file_exists('../img')) {
  mkdir('../img');
}

if (!file_exists('../xml')) {
  mkdir('../xml');
}

// 受け取った profilename と appname からローカルのxmlのパスを取得
$steamAchievementXMLUrl = '../xml/' . $appname . '_' .$profilename . '.xml';

// 削除
// 出力
echo unlink($steamAchievementXMLUrl);

?>
