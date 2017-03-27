<?php

$profilename = $_GET['profilename'];
$appname = $_GET['appname'];

// 受け取った profilename と appname からxmlを取得
$steamProfileXMLUrl = "http://steamcommunity.com/id/" . $profilename . "/stats/" . $appname . "/achievements/?xml=1";
$steamProfileXML = file_get_contents($steamProfileXMLUrl);

// XMLとして読み込む
$parseXML = new SimpleXMLElement($steamProfileXML, LIBXML_NOCDATA);

// 実績画像のパスだけ取得
$achievementIconUrl = $parseXML->avatarMedium;

// 実績画像のファイル名とパス
$achievementIconFileName = pathinfo($achievementIconUrl, PATHINFO_BASENAME);
$achievementIconFilePath = "../img/" . $achievementIconFileName;

// imgフォルダにないときはDL
if (!file_exists($achievementIconFilePath)) {
  $achievementIcon = file_get_contents($achievementIconUrl);
  file_put_contents($achievementIconFilePath, $achievementIcon);
}

// 実績画像のパスをルートから見たサーバ内に変更する
$parseXML->avatarMedium = 'img/' . $achievementIconFileName;

echo $parseXML->asXML();

?>
