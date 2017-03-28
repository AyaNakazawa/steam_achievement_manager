
<?php

$profilename = $_GET['profilename'];
$appname = $_GET['appname'];

// 受け取った profilename と appname からxmlを取得
$steamAchievementXMLUrl = 'http://steamcommunity.com/id/' . $profilename . '/stats/' . $appname . '/achievements/?xml=1';
$steamAchievementXML = file_get_contents($steamAchievementXMLUrl);

// XMLとして読み込む
$parseXML = new SimpleXMLElement($steamAchievementXML, LIBXML_NOCDATA);

// ゲームロゴのパスだけ取得
$gameLogoUrl = $parseXML->game->gameLogo;

// ゲームロゴのファイル名とパス
$gameLogoFileName = pathinfo($gameLogoUrl, PATHINFO_BASENAME);
$gameLogoFilePath = '../img/' . $gameLogoFileName;

// imgフォルダにないときはDL
if (!file_exists($gameLogoFilePath)) {
  $gameLogo = file_get_contents($gameLogoUrl);
  file_put_contents($gameLogoFilePath, $gameLogo);
}

// ゲームロゴのパスをルートから見たサーバ内に変更する
$parseXML->game->gameLogo = 'img/' . $gameLogoFileName;

// 実績画像の処理用にxmlを保存
$steamAchievementXMLFilePath = '../xml/' . $appname . '_' .$profilename . '.xml';
$steamAchievementXML = $parseXML->asXML();
file_put_contents($steamAchievementXMLFilePath, $steamAchievementXML);

// 出力
echo $steamAchievementXML;

?>
