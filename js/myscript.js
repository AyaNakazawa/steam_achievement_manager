
var addDataErrorCount = 0;

var profilename = "";
var appname = "";

$(function() {
  
  // ローカルストレージ対応判定
  if(!localStorage) {
    alert('ローカルストレージに対応していないため、データを保存できません');
  }
  
  // dataの検索
  $('#data-search-submit').click(function() {
    console.log("Data search click");
    
    addDataErrorCount = 0;
    var searchPerm = true;
    
    profilename = $('#profilename').val();
    appname = $('#appname').val();
    
    $('.data-error').empty();
    
    // 入力欄判定
    if (profilename.length === 0){
      searchPerm = false;
      addDataError("Profile nameを入力してください");
    }
    if (appname.length === 0){
      searchPerm = false;
      addDataError("Game nameを入力してください");
    }
    
    // 検索の実行
    if (searchPerm) {
      dataSearch();
    } else {
      console.log("Data search NG");
      
    }
    
  });
  
  // リセット
  $('.action-reset').click(function() {
    console.log("Reset click");
    dataReset();
  });
  
  // 履歴
  $('.action-history').click(function() {
    console.log("History click");
  });
  
  // 再読込
  $('.action-reload').click(function() {
    console.log("Reload click");
    dataSearch();
  });
  
  // # アンカーのスクロール
  $(document).on('click', '#pagetop', function() {
    console.log("Pagetop scroll");
    $('body,html').animate({scrollTop:0}, 500);
  });
  
});

// function

// エラーを追加
function addDataError(errorString){
  if (addDataErrorCount === 0){
    $(".data-error").append('<div class="alert alert-warning data-error-list" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="閉じる"><span aria-hidden="true">×</span></button></div>');
  }
  var errorItem = $("<p>").text(errorString);
  $(".data-error-list").append(errorItem);
  addDataErrorCount++;
}

// 検索
function dataSearch(){
  console.log("Data search start");
  
  if (profilename.length === 0 || appname.length === 0){
    return;
  }
  
  dataReset();
  
  // ajax ゲーム情報と実績を取得
  $.get('php/getAchievementXML.php', {profilename:profilename, appname:appname}, function(data){
    console.log("Get achievement xml");
    console.log("\t" + appname + " for " + profilename);
    // console.log(data);
    
    // 準備
    var achievements = $(data).find("achievements").find("achievement");
    var achievementsLength = achievements.length;
    
    // 存在確認
    if (achievementsLength === 0){
      console.log("Load faild");
      return;
    }
    
    $(".main").append('<div class="achievement-area"><div class="achievement-info-area"><a class="achievement-appicon" target="_blank"><img alt="game icon"></a><div class="achievement-top"><h2 class="achievement-appname"></h3><p class="achievement-profilename"></p></div><a class="achievement-usericon" target="_blank"><img alt="user icon"></a></div><div class="achievement-search-area"><div class="input-group achievement-search-form"><input type="text" id="achievement-search" placeholder="Search achievements" class="form-control achievement-search-text"><span class="input-group-btn achievement-search-button"><button type="button" id="achievement-search-submit" class="btn btn-default"><i class="fa fa-search" aria-hidden="true"></i></button></span></div></div><div class="achievement-list-area"></div></div><div id="pagetop">PAGE TOP</div>');
    
    // ゲーム名の表示
    var gameName = $(data).find("game").find("gameName").text();
    $(".achievement-appname").text(gameName);
    
    // ゲームロゴの表示とリンク
    var appIconFilePath = $(data).find("game").find("gameLogo").text();
    var appLink = $(data).find("game").find("gameLink").text();
    $(".achievement-appicon > img").attr("src", appIconFilePath);
    $(".achievement-appicon").attr("href", appLink);
    
    // ajax ユーザーを取得
    $.get('php/getUserXML.php', {profilename:profilename}, function(data){
      console.log("Get user xml");
      console.log("\t" + profilename);
      // console.log(data);
      
      // ユーザー名の表示
      var userName = $(data).find("steamID").text();
      $(".achievement-profilename").text(userName);
      
      // アバターの表示とリンク
      var userIconFileList = $(data).find("avatarMedium");
      var userIconFilePath = $(userIconFileList[0]).text();
      $(".achievement-usericon > img").attr("src", userIconFilePath);
      $(".achievement-usericon").attr("href", "http://steamcommunity.com/id/" + profilename);
      
    });
    
    var achievementCount = 0;
    var exitFlg = "false";
    
    // 実績内容
    console.log("Get achievement");
    achievements.each(function() {
        // console.log($(this).find("name").text() + " " + $(this).attr("closed"));
        
        // 要素に値を設定
        var timestamp = "Lock";
        if ($(this).attr("closed") === "1") {
          var unlockDate = new Date(1000 * $(this).find("unlockTimestamp").text());
          timestamp = "" + ("000" + unlockDate.getFullYear()).slice(-4);
          timestamp += "/" + ("0" + (unlockDate.getMonth() + 1)).slice(-2);
          timestamp += "/" + ("0" + unlockDate.getDate()).slice(-2);
          timestamp += " " + ("0" + unlockDate.getHours()).slice(-2);
          timestamp += ":" + ("0" + unlockDate.getMinutes()).slice(-2);
          timestamp += ":" + ("0" + unlockDate.getSeconds()).slice(-2);
        } 
        
        var achievementName = $(this).find("name").text();
        var achievementDescription = $(this).find("description").text();
        
        // 実績追加
        $(".achievement-list-area").append('<div class="achievement-item" id="achievement-item-' + achievementCount + '"><img alt="achievement icon" class="achievement-item-icon"><div class="achievement-item-top"><h3 class="achievement-item-title">' + achievementName + '</h3><p class="achievement-item-timestamp">' + timestamp + '</p></div><p class="achievement-item-desc">' + achievementDescription + '</p><div class="input-group"></div></div>');
        
        achievementCount++;
      
    });
    
    var achievementCount = 0;
    
    // ajax 実績画像を取得
    console.log("Get achievement image");
    achievements.each(function() {
      $.get('php/getAchievementImage.php', {profilename:profilename, appname:appname, achievementCount:achievementCount, exitFlg:exitFlg}, function(data){
        // console.log($(data).find("id").text() + ": " + data);
        
        // アイコンパス
        var iconFilePath;
        if ($(data).find("closed").text() === "1") {
          iconFilePath = $(data).find("iconClosed").text();
        } else {
          iconFilePath = $(data).find("iconOpen").text();
        }
        
        // console.log($(data).find("id").text() + ": " + $(data).find("closed").text());
        
        // アイコンを設定
        $("#achievement-item-" + $(data).find("id").text() + " .achievement-item-icon").attr("src", iconFilePath);
        $("#achievement-item-" + $(data).find("id").text() + " .achievement-item-icon").attr("alt", "achievement icon");
        
      });
      
      achievementCount++;
      
      // 次が最後なら exitFlg 立てる
      if (achievementCount + 1 === achievementsLength){
        exitFlg = "true";
      }
      
    });
    
  });
  
}

function dataReset(){
  $(".achievement-area").remove();
  $("#pagetop").remove();
  
}
