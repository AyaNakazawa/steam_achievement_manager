
// グローバル変数
var appname = "";
var profilename = "";

var addDataErrorCount = 0;

var localStorageFlg = true;

// 定数
const LOCAL_STORAGE_HISTORY_KEY = "steamAchievementManagerHistoryV1";
const HTML_ACHIEVEMENT_AREA = '<div class="achievement-area"><div class="achievement-info-area"><a class="achievement-appicon" target="_blank"><img alt="Game logo loading..."></a><div class="achievement-top"><h2 class="achievement-appname"></h3><p class="achievement-profilename"></p></div><a class="achievement-usericon" target="_blank"><img alt="User icon loading..."></a></div><div class="achievement-search-area"><div class="input-group achievement-search-form"><input type="text" id="achievement-search" placeholder="Search achievements" class="form-control achievement-search-text"><span class="input-group-btn achievement-search-button"><button type="button" id="achievement-search-submit" class="btn btn-default"><i class="fa fa-search" aria-hidden="true"></i></button></span></div></div><div class="achievement-list-area"></div></div>';

$(function() {
  
  // ----------------------------------------------------------------
  // ローカルストレージ対応判定
  if(!localStorage) {
    console.log('"Local Storage" is unsupported. Data can not be saved.');
    console.log('"ローカルストレージ"機能に対応していません。データを保存することができません。');
    localStorageFlg = false;
  }
  
  // ----------------------------------------------------------------
  // トップまでのスクロール
  $(document).on('click', '#pagetop', function() {
    console.log("Scroll to Top");
    $('body,html').animate({scrollTop:0}, 500);
  });
  
  // ----------------------------------------------------------------
  // dataの検索
  $('#data-search-submit').click(function() {
    // console.log("Click Data search");
    
    addDataErrorCount = 0;
    var searchPerm = true;
    
    appname = $('#appname').val();
    profilename = $('#profilename').val();
    
    deleteDataError();
    
    // 入力欄判定
    if (appname.length === 0){
      searchPerm = false;
      addDataError("Game nameを入力してください");
    }
    if (profilename.length === 0){
      searchPerm = false;
      addDataError("Profile nameを入力してください");
    }
    
    // 検索の実行
    if (searchPerm) {
      dataSearch();
    } else {
      console.log("Data search NG");
      
    }
    
  });
  
  // ----------------------------------------------------------------
  // タイトル
  $('#title').click(function() {
    // console.log("Click Title");
    
    location.reload();
    
  });
  
  // ----------------------------------------------------------------
  // リセット
  $('.action-reset').click(function() {
    // console.log("Click Reset");
    
    deleteDataError();
    deleteAchievementArea();
  });
  
  // ----------------------------------------------------------------
  // 履歴リスト
  $('.action-history-header').click(function() {
    // console.log("Click History header");
    
    $('.action-history-list').empty();
    
    var arrayOfHistory = getHistory();
    
    if (arrayOfHistory.length > 0){
      $(arrayOfHistory).each(function() {
        // console.log(this);
        $('.action-history-list').append('<li class="action-history-item" data-appname="' + this["appname"] + '" data-profilename="' + this["profilename"] + '"><a>' + this["appname"] + ': ' + this["profilename"] + '</a></li>');
        
      });
    } else {
      $('.action-history-list').append('<li class="action-history-item" data-appname="" data-profilename=""><a>Nothing</a></li>');
    }
    
  });
  
  // ----------------------------------------------------------------
  // 履歴項目
  $(document).on('click', '.action-history-item', function() {
    // console.log("Click History item");
    
    appname = $(this).attr("data-appname");
    profilename = $(this).attr("data-profilename");
    
    if (appname.length === 0){
      return;
    }
    if (profilename.length === 0){
      return;
    }
    
    $('#appname').val(appname);
    $('#profilename').val(profilename);
    
    addDataErrorCount = 0;
    deleteDataError();
    
    dataSearch();
  });
  
  // ----------------------------------------------------------------
  // 再読込
  $('.action-reload').click(function() {
    // console.log("Click Reload");
  
    addDataErrorCount = 0;
    deleteDataError();
    
    dataSearch();
  });
  
  // ----------------------------------------------------------------
  // ローカルストレージを初期化
  $('.action-localStorage-reset').click(function() {
    // console.log("Click LocalStorage reset");
    
    showConfirmDialog("ローカルストレージの初期化", "ローカルストレージに保存されている内容を全て初期化します。\nよろしいですか？", initializeLocalStorage)
  });
  
});

// ----------------------------------------------------------------
// Functions

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
  
  var searchPerm = true;
  
  if (appname.length === 0){
    searchPerm = false;
    addDataError("Game nameを入力してください");
  }
  
  if (profilename.length === 0){
    searchPerm = false;
    addDataError("Profile nameを入力してください");
  }
  
  if (!searchPerm) {
    console.log("Data search NG");
    return;
  }
  
  deleteAchievementArea();
  
  // ajax ゲーム情報と実績を取得
  $.get('php/getAchievementXML.php', {appname:appname, profilename:profilename}, function(data){
    console.log("Get achievement xml");
    console.log("\t" + appname + " for " + profilename);
    // console.log(data);
    
    // 準備
    var achievements = $(data).find("achievements").find("achievement");
    var achievementsLength = achievements.length;
    
    // 存在確認
    if (achievementsLength === 0){
      console.log("Load faild");
      addDataError("実績情報の読み込みに失敗しました");
      addDataError("正確な値を入力してください");
      $.get('php/deleteAchievementXML.php', {appname:appname, profilename:profilename}, function(data){
        
        if (data) {
          console.log("Deleted local XML.");
        } else {
          console.log("Failed to delete local XML.");
        }
        
      });
      return;
    }
    
    // 履歴の更新
    updateHistory(appname, profilename);
    
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
      $.get('php/getAchievementImage.php', {appname:appname, profilename:profilename, achievementCount:achievementCount, exitFlg:exitFlg}, function(data){
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
// エラーリストを削除
function deleteDataError(){
  $('.data-error').empty();
  
}

// ----------------------------------------------------------------
// 実績領域を生成
function getHtmlAchievementArea() {
  return HTML_ACHIEVEMENT_AREA;
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
  var date = _date || new Date();
  var dateString = "";
  dateString += "" + ("000" + _date.getFullYear()).slice(-4);
  dateString += "/" + ("0" + (_date.getMonth() + 1)).slice(-2);
  dateString += "/" + ("0" + _date.getDate()).slice(-2);
  dateString += " " + ("0" + _date.getHours()).slice(-2);
  dateString += ":" + ("0" + _date.getMinutes()).slice(-2);
  dateString += ":" + ("0" + _date.getSeconds()).slice(-2);
  return dateString;
}

// ----------------------------------------------------------------
// 履歴を更新
function updateHistory(_appname, _profilename){
  console.log("localStorageHistory: update");
  
  var arrayOfHistoryValue;
  
  var appname = _appname || "defaultApp";
  var profilename = _profilename || "defaultUser";
  
  // 履歴に追加
  var localStorageActiveKey = appname + ":" + profilename;
  var localStorageHistoryValue = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
  
  // 履歴が存在する場合は整形
  if (localStorageHistoryValue != null) {
    console.log("localStorageHistoryValue: " + localStorageHistoryValue);
    console.log("localStorageHistoryValue: ↓");
  
    localStorageHistoryValue = localStorageHistoryValue.replace(/\s+/g, "");
    arrayOfHistoryValue = localStorageHistoryValue.split(",");
  }
  
  localStorageHistoryValue = localStorageActiveKey;
  
  if (arrayOfHistoryValue != null) {
    for (var i = 0; i < arrayOfHistoryValue.length; i++) {
      if (arrayOfHistoryValue[i] === localStorageActiveKey) {
        continue;
      }
      localStorageHistoryValue += ", " + arrayOfHistoryValue[i];
      
    }
  }
  
  console.log("localStorageHistoryValue: " + localStorageHistoryValue);
  localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, localStorageHistoryValue);
  
}

// ----------------------------------------------------------------
// 履歴配列を取得
function getHistory(){
  // console.log("Get history");
  
  var arrayOfHistoryValue;
  var arrayOfHistory = [];

  // 履歴を取得
  var localStorageHistoryValue = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
  
  // 履歴が存在する場合は整形
  if (localStorageHistoryValue != null) {
    localStorageHistoryValue = localStorageHistoryValue.replace(/\s+/g, "");
    arrayOfHistoryValue = localStorageHistoryValue.split(",");
    
    for (var i = 0; i < arrayOfHistoryValue.length; i++) {
      var arrayOfHistoryItem = arrayOfHistoryValue[i].split(":");
      arrayOfHistory[i] = {
        "appname": arrayOfHistoryItem[0],
        "profilename": arrayOfHistoryItem[1]
      };
    }
  }
  
  // console.log(arrayOfHistory);
  return arrayOfHistory;
}

// ----------------------------------------------------------------
// 確認モーダルウィンドウ
function showConfirmDialog(_dialogTitle, _dialogContent, _callbackFunction) {
  var dialogTitle = _dialogTitle || "確認";
  var dialogContent = _dialogContent || "内容";
  var callbackFunction = _callbackFunction || function(){};
  
  // モーダルウィンドウを表示
  $("#modalDialog").text( dialogContent );
  $("#modalDialog").dialog({
    modal: true,
    title: dialogTitle,
    buttons: {
      "OK": function() {
        callbackFunction(true);
        $(this).dialog("close");
      },
      "キャンセル": function() {
        callbackFunction(false);
        $(this).dialog("close");
      }
    }
  });
}

// ----------------------------------------------------------------
// ローカルストレージの初期化
function initializeLocalStorage(_initializeFlg) {
  
  // var initializeFlg = _initializeFlg || true;
  // で初期値与えようとすると false がきたとき true を持ってくるから使えない

  var initializeFlg = _initializeFlg;
  if (initializeFlg === null) {
    initializeFlg = true;
  }
  
  if (initializeFlg) {
    console.log("LocalStorage Reset");
    localStorage.clear();
    
  }
}
