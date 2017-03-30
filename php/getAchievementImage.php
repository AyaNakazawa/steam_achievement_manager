
<?php

$appname = $_GET['appname'];
$profilename = $_GET['profilename'];

$achievementCount = intval($_GET['achievementCount']);
$exitFlg = $_GET['exitFlg'];

// 受け取った profilename と appname からローカルのxmlを取得
$steamAchievementXMLUrl = '../xml/' . $appname . '_' .$profilename . '.xml';
$steamAchievementXML = file_get_contents($steamAchievementXMLUrl);

// 出力用xmlを作成
$outXML = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><icons></icons>');

// 最後ならXMLを削除
if ( $exitFlg == "true" ){
  unlink($steamAchievementXMLUrl);
}

// XMLとして読み込む
$parseXML = new SimpleXMLElement($steamAchievementXML, LIBXML_NOCDATA);

// アイコン用
$iconNames = array('iconClosed', 'iconOpen');

// achievementCountから実績を選ぶ
$achievement = ($parseXML->achievements->achievement)[$achievementCount];

foreach ($iconNames as $iconName) {
  // 画像のパスだけ取得
  $achievementIconUrl = $achievement->$iconName;
  
  // 画像のファイル名とパス
  $achievementIconFileName = pathinfo($achievementIconUrl, PATHINFO_BASENAME);
  $achievementIconFilePath = '../img/' . $achievementIconFileName;
  
  // imgフォルダにないときはDL
  if (!file_exists($achievementIconFilePath)) {
    $achievementIcon = file_get_contents($achievementIconUrl);
    file_put_contents($achievementIconFilePath, $achievementIcon);
  }
  
  // 画像のパスをルートから見たサーバ内に変更する
  $outXML->$iconName = 'img/' . $achievementIconFileName;
}

// クリア状況を付与
$outXML->closed = $achievement['closed'];
$outXML->id = $achievementCount;

// 出力
echo $outXML->asXML();

?>
