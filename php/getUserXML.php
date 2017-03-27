<?php

$profilename = $_GET['profilename'];

// 受け取った profilename からxmlを取得
$steamProfileXMLUrl = "http://steamcommunity.com/id/" . $profilename . "/?xml=1";
$steamProfileXML = file_get_contents($steamProfileXMLUrl);

// XMLとして読み込む
$parseXML = new SimpleXMLElement($steamProfileXML, LIBXML_NOCDATA);

// アバターのパスだけ取得
$userIconUrl = $parseXML->avatarMedium;

// アバターのファイル名とパス
$userIconFileName = pathinfo($userIconUrl, PATHINFO_BASENAME);
$userIconFilePath = "../img/" . $userIconFileName;

// imgフォルダにないときはDL
if (!file_exists($userIconFilePath)) {
  $userIcon = file_get_contents($userIconUrl);
  file_put_contents($userIconFilePath, $userIcon);
}

// アバターのパスをルートから見たサーバ内に変更する
$parseXML->avatarMedium = 'img/' . $userIconFileName;

echo $parseXML->asXML();
?>
