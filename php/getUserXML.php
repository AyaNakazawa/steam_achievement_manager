
<?php

$profilename = $_GET['profilename'];

if (!file_exists('../img')) {
  mkdir('../img');
}

if (!file_exists('../xml')) {
  mkdir('../xml');
}

// 受け取った profilename からxmlを取得
$steamProfileXMLUrl = 'http://steamcommunity.com/id/' . $profilename . '/?xml=1';
$steamProfileXML = file_get_contents($steamProfileXMLUrl);

// XMLとして読み込む
$parseXML = new SimpleXMLElement($steamProfileXML, LIBXML_NOCDATA);

// profile画像のパスだけ取得
$userIconUrl = $parseXML->avatarMedium;

// profile画像のファイル名とパス
$userIconFileName = pathinfo($userIconUrl, PATHINFO_BASENAME);
$userIconFilePath = '../img/' . $userIconFileName;

// imgフォルダにないときはDL
if (!file_exists($userIconFilePath)) {
  $userIcon = file_get_contents($userIconUrl);
  file_put_contents($userIconFilePath, $userIcon);
}

// profile画像のパスをルートから見たサーバ内に変更する
$parseXML->avatarMedium = 'img/' . $userIconFileName;

// 出力
echo $parseXML->asXML();

?>
