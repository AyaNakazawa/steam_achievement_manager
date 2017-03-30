
var addDataErrorCount = 0;

var profilename = "";
var appname = "";

var localStorageFlg = true;

$(function() {
  
  // ----------------------------------------------------------------
  // ローカルストレージ対応判定
  if(!localStorage) {
    console.log('"Local Storage" is unsupported. Data can not be saved.');
    localStorageFlg = false;
  }
  
  // ----------------------------------------------------------------
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
  
  // ----------------------------------------------------------------
  // リセット
  $('.action-reset').click(function() {
    console.log("Reset click");
    
    $('.data-error').empty();
    deleteAchievementArea();
  });
  
  // 履歴
  $('.action-history').click(function() {
    console.log("History click");
  });
  
  // 再読込
  $('.action-reload').click(function() {
    console.log("Reload click");
  
    addDataErrorCount = 0;
    $('.data-error').empty();
    
    dataSearch();
  });
  
  // # アンカーのスクロール
  $(document).on('click', '#pagetop', function() {
    console.log("Pagetop scroll");
    $('body,html').animate({scrollTop:0}, 500);
  });
  
});

// ----------------------------------------------------------------
// function
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// エラーを追加
function addDataError(errorString){
  if (addDataErrorCount === 0){
    $(".data-error").append('<div class="alert alert-warning data-error-list" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="閉じる"><span aria-hidden="true">×</span></button></div>');
  }
  var errorItem = $("<p>").text(errorString);
  $(".data-error-list").append(errorItem);
  addDataErrorCount++;
}

// ----------------------------------------------------------------
// 検索
function dataSearch(){
  console.log("Data search start");
  
  if (profilename.length === 0){
    addDataError("Profile nameを入力してください");
    return;
  }
  if (appname.length === 0){
    addDataError("Game nameを入力してください");
    return;
  }
  
  deleteAchievementArea();
  
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
      addDataError("Profile name か Game name に異常があります。");
      return;
    }
    
    // 実績領域を追加
    $(".main").append(getHtmlAchievementArea());
    $(".main").append(getHtmlPagetop());
    
    // ゲーム名の表示
    var gameName = $(data).find("game").find("gameName").text();
    $(".achievement-appname").text(gameName);
    
    // ゲームロゴの表示とリンク
    var appIconPath = $(data).find("game").find("gameLogo").text();
    var appLink = $(data).find("game").find("gameLink").text();
    $(".achievement-appicon > img").attr("src", appIconPath);
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
      var userIconPathList = $(data).find("avatarMedium");
      var userIconPath = $(userIconPathList[0]).text();
      $(".achievement-usericon > img").attr("src", userIconPath);
      $(".achievement-usericon").attr("href", "http://steamcommunity.com/id/" + profilename);
      
    });
    
    var achievementCount = 0;
    
    // 実績内容
    console.log("Get achievement");
    achievements.each(function() {
        // console.log($(this).find("name").text() + " " + $(this).attr("closed"));
        
        // 実績追加
        $(".achievement-list-area").append(getHtmlAchievementItem(this, achievementCount));
        
        achievementCount++;
      
    });
    
    achievementCount = 0;
    var exitFlg = "false";
    
    // ajax 実績画像を取得
    console.log("Get achievement image");
    achievements.each(function() {
      $.get('php/getAchievementImage.php', {profilename:profilename, appname:appname, achievementCount:achievementCount, exitFlg:exitFlg}, function(data){
        // console.log($(data).find("id").text() + ": " + data);
        
        // アイコンパス
        var achievementItemIconPath;
        if ($(data).find("closed").text() === "1") {
          achievementItemIconPath = $(data).find("iconClosed").text();
        } else {
          achievementItemIconPath = $(data).find("iconOpen").text();
        }
        
        // console.log($(data).find("id").text() + ": " + $(data).find("closed").text());
        
        var achievementItemId = $(data).find("id").text();
        var achievementItemSelector = "#achievement-item-" + achievementItemId;
        
        // アイコンを設定
        $(achievementItemSelector + " .achievement-item-icon").attr("src", achievementItemIconPath);
        $(achievementItemSelector + " .achievement-item-icon").attr("alt", "achievement icon");
        
      });
      
      achievementCount++;
      
      // 次が最後なら exitFlg 立てる
      if (achievementCount + 1 === achievementsLength){
        exitFlg = "true";
      }
      
    });
    
  });
  
}

// ----------------------------------------------------------------
// 実績領域を削除
function deleteAchievementArea(){
  $(".achievement-area").remove();
  $("#pagetop").remove();
  
}

// ----------------------------------------------------------------
// 実績領域を生成
function getHtmlAchievementArea() {
  return '<div class="achievement-area"><div class="achievement-info-area"><a class="achievement-appicon" target="_blank"><img alt="Game logo loading..."></a><div class="achievement-top"><h2 class="achievement-appname"></h3><p class="achievement-profilename"></p></div><a class="achievement-usericon" target="_blank"><img alt="User icon loading..."></a></div><div class="achievement-search-area"><div class="input-group achievement-search-form"><input type="text" id="achievement-search" placeholder="Search achievements" class="form-control achievement-search-text"><span class="input-group-btn achievement-search-button"><button type="button" id="achievement-search-submit" class="btn btn-default"><i class="fa fa-search" aria-hidden="true"></i></button></span></div></div><div class="achievement-list-area"></div></div>';
}

// ----------------------------------------------------------------
// 実績を生成
function getHtmlAchievementItem(_achievementItem, _achievementCount) {
  
  // 値を取得
  var timestamp = "Lock";
  if ($(_achievementItem).attr("closed") === "1") {
    var unlockDate = new Date(1000 * $(_achievementItem).find("unlockTimestamp").text());
    timestamp = getDateString(unlockDate);
  } 
  
  var achievementName = $(_achievementItem).find("name").text();
  var achievementDescription = $(_achievementItem).find("description").text();
  
  return '<div class="achievement-item" id="achievement-item-' + _achievementCount + '"><img alt="achievement icon loading..." class="achievement-item-icon"><div class="achievement-item-top"><h3 class="achievement-item-title">' + achievementName + '</h3><p class="achievement-item-timestamp">' + timestamp + '</p></div><p class="achievement-item-desc">' + achievementDescription + '</p></div>';
}

// ----------------------------------------------------------------
// pagetopを生成
function getHtmlPagetop() {
  return '<div id="pagetop">PAGE TOP</div>';
}

// ----------------------------------------------------------------
// Dateオブジェクトからゼロ埋めした日時文字列を生成
function getDateString(_date){
  var dateString = "";
  dateString += "" + ("000" + _date.getFullYear()).slice(-4);
  dateString += "/" + ("0" + (_date.getMonth() + 1)).slice(-2);
  dateString += "/" + ("0" + _date.getDate()).slice(-2);
  dateString += " " + ("0" + _date.getHours()).slice(-2);
  dateString += ":" + ("0" + _date.getMinutes()).slice(-2);
  dateString += ":" + ("0" + _date.getSeconds()).slice(-2);
  return dateString;
}
