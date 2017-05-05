
// グローバル変数
var appname = "";
var profilename = "";
var achievementSearchType = "OR";

var addDataErrorCount = 0;

var localStorageFlg = true;
var inputSwitchFlg = true;

var achievementList = [];

// 定数
const LOCAL_STORAGE_HISTORY_KEY = "steamAchievementManagerHistoryV1";
const HTML_ACHIEVEMENT_AREA =
  '<div class="achievement-area"><div class="achievement-info-area"><a class="achievement-appicon" target="_blank"><img alt="Game logo loading..."></a><a class="achievement-usericon" target="_blank"><img alt="User icon loading..."></a><div class="achievement-top"><h2 class="achievement-appname"></h2><p class="achievement-profilename"></p></div></div><div class="achievement-search-area"><div class="input-group achievement-search-form"><span class="input-group-btn achievement-search-type"><button type="button" class="btn btn-default dropdown-toggle achievement-search-type-dropdown" data-toggle="dropdown" aria-expanded="false">OR <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li class="achievement-search-type-button" data-achievement-search-type="OR"><a>OR</a></li><li class="achievement-search-type-button" data-achievement-search-type="AND"><a>AND</a></li><li class="achievement-search-type-button" data-achievement-search-type="NOR"><a>NOR</a></li><li class="achievement-search-type-button" data-achievement-search-type="NAND"><a>NAND</a></li></ul></span><input type="text" id="achievement-search" placeholder="Search achievements" class="form-control achievement-search-text"></div><div class="achievement-search-result"></div></div><div class="achievement-list-area"></div></div>';
const helpContent =
  '<ol><li>ゲーム名 と ユーザー名 を入力すると、実績情報を自動で取得し、表示します。</li><ul><li>ゲーム名</li><ul><li>gameFriendlyName</li></ul><li>ユーザー名</li><ul><li>customURL</li></ul></ul><li>検索バーに文字列を入力すると、実績が絞り込まれます。</li><ul><li>検索用シンボル</li><ul><li>文字列 - 文字列が 実績名 解除日時 実績内容 メモ に含まれるか</li><li>$c - クリアしているか</li><li>$c1 - チェックボックス1</li><li>$c10 - チェックボックス10</li><li>! - シンボルの先頭に ! をつけると否定</li></ul><li>区切り文字</li><ul><li>スペース - スペースを区切り文字として、論理演算を行う</li></ul><li>論理演算子</li><ul><li>OR - シンボルが一つでも真ならTrue</li><li>AND - 全てのシンボルが真ならTrue</li><li>NOR - シンボルが一つでも偽ならTrue</li><li>NAND - 全てのシンボルが偽ならTrue</li></ul></ul><li>ゲーム名 と ユーザー名 の組み合わせと、それぞれの実績の メモ と チェック状況 はブラウザに保存され、次回以降それぞれ自動で表示されます。</li><ul><li>localStorageを使用</li></ul></ol>';

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
    $('body,html').animate({scrollTop:$(".achievement-area").offset().top}, 500);
  });
  
  // ----------------------------------------------------------------
  // データの検索
  $(document).on('click', '#data-search-submit', function() {
    // console.log("Click Data search");
    
    runSearchData();
    
  });
  
  // ----------------------------------------------------------------
  // エンターキーでデータの検索
  $(document).on('keypress', '#appname', function(e) {
    console.log("Keypress in appname");
    if (e.which === 13) {
      runSearchData();
    }
  });
  $(document).on('keypress', '#profilename', function(e) {
    console.log("Keypress in profilename");
    if (e.which === 13) {
      runSearchData();
    }
  });
  
  // ----------------------------------------------------------------
  // タイトル
  $(document).on('click', '#title', function() {
    // console.log("Click Title");
    
    location.reload();
    
  });
  
  // ----------------------------------------------------------------
  // リセット
  $(document).on('click', '.action-reset', function() {
    // console.log("Click Reset action");
    
    deleteDataError();
    deleteAchievementArea();
  });
  
  // ----------------------------------------------------------------
  // 履歴リスト
  $(document).on('click', '.action-history-header', function() {
    // console.log("Click History header action");
    
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
    // console.log("Click History item action");
    
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
    
    searchData();
  });
  
  // ----------------------------------------------------------------
  // 再読込
  $(document).on('click', '.action-reload', function() {
    // console.log("Click Reload action");
  
    addDataErrorCount = 0;
    deleteDataError();
    
    searchData();
  });
  
  // ----------------------------------------------------------------
  // ローカルストレージを初期化
  $(document).on('click', '.action-localStorage-reset', function() {
    // console.log("Click LocalStorage reset action");
    
    showConfirmDialog("ローカルストレージの初期化", "<p>ローカルストレージに保存されている内容を全て初期化します。<br>よろしいですか？</p>", initializeLocalStorage)
  });
  
  // ----------------------------------------------------------------
  // ヘルプ
  $(document).on('click', '.action-help', function() {
    // console.log("Click Help action");
    
    showDialog("ヘルプ", helpContent);
    
  });
  
  // ----------------------------------------------------------------
  // データ入力切り替え
  $(document).on('click', '.action-input-switch', function() {
    // console.log("Click Input switch action");
    inputSwitchFlg = toggleBoolean(inputSwitchFlg);
    
    addDataErrorCount = 0;
    deleteDataError();
    
    searchData();
  });
  
  // ----------------------------------------------------------------
  // 実績を検索
  $(document).on('change', '.achievement-search-text', function() {
    console.log("Change Achievement search text: " + $(this).val());
    
    var queryString = $(this).val();
    
    filterAchievement(queryString);
    
  });
  
  // ----------------------------------------------------------------
  // 実績検索タイプを指定
  $(document).on('click', '.achievement-search-type-button', function() {
    // console.log("Click Achievement search type button: " + $(this).attr("data-achievement-search-type"));
    
    achievementSearchType = $(this).attr("data-achievement-search-type");
    var tempText = achievementSearchType + ' <span class="caret"></span>';
    
    $(".achievement-search-type-dropdown").html(tempText);
    
    var queryString = $(".achievement-search-text").val();
    
    filterAchievement(queryString);
    
  });
  
  // ----------------------------------------------------------------
  // 実績項目のメモを更新
  $(document).on('change', '.achievement-item-memo-text', function() {
    // console.log("Change Achievement search text: " + $(this).val());
    
    achievementId = $(this).parent().parent().parent().attr("data-id");
    
    // ローカルストレージからメモとチェック状況を読み込み
    var tempKey = "";
    tempKey += "samAI";
    tempKey += "-" + appname;
    tempKey += "-" + profilename;
    tempKey += "-" + achievementId;
    
    // メモ
    var localStorageAchievementItemMemoKey = tempKey + "-m";
    var localStorageAchievementItemMemoValue = $(this).val();
    
    console.log(localStorageAchievementItemMemoKey + " <- " + localStorageAchievementItemMemoValue);
    
    achievementList[achievementId]["memo"] = localStorageAchievementItemMemoValue;
    
    localStorage.setItem(localStorageAchievementItemMemoKey, localStorageAchievementItemMemoValue);
    
  });
  
  // ----------------------------------------------------------------
  // 実績項目のチェック状況を更新
  $(document).on('click', '.achievement-item-checkbox-area', function() {
    
    achievementId = $(this).parent().parent().parent().attr("data-id");
    checkId = $(this).find("input").attr("class");
    checkId = checkId.substr(checkId.length - 1);
    
    console.log("checkId: " + checkId);
    
    if (achievementList[achievementId]["check" + checkId] === "t") {
      achievementList[achievementId]["check" + checkId] = "f";
    } else {
      achievementList[achievementId]["check" + checkId] = "t";
    }
  
    // ローカルストレージからメモとチェック状況を読み込み
    var tempKey = "";
    tempKey += "samAI";
    tempKey += "-" + appname;
    tempKey += "-" + profilename;
    tempKey += "-" + achievementId;
    
    // チェック
    var localStorageAchievementItemCheckKey = tempKey + "-c";
    var localStorageAchievementItemCheckValue = "";
    
    if (achievementList[achievementId]["check1"] === "t") {
      localStorageAchievementItemCheckValue += "t";
    } else {
      localStorageAchievementItemCheckValue += "f";
    }
    if (achievementList[achievementId]["check2"] === "t") {
      localStorageAchievementItemCheckValue += "t";
    } else {
      localStorageAchievementItemCheckValue += "f";
    }
    if (achievementList[achievementId]["check3"] === "t") {
      localStorageAchievementItemCheckValue += "t";
    } else {
      localStorageAchievementItemCheckValue += "f";
    }
    if (achievementList[achievementId]["check4"] === "t") {
      localStorageAchievementItemCheckValue += "t";
    } else {
      localStorageAchievementItemCheckValue += "f";
    }
    if (achievementList[achievementId]["check5"] === "t") {
      localStorageAchievementItemCheckValue += "t";
    } else {
      localStorageAchievementItemCheckValue += "f";
    }
    
    var check1 = localStorageAchievementItemCheckValue.substr(0,1);
    var check2 = localStorageAchievementItemCheckValue.substr(1,1);
    var check3 = localStorageAchievementItemCheckValue.substr(2,1);
    var check4 = localStorageAchievementItemCheckValue.substr(3,1);
    var check5 = localStorageAchievementItemCheckValue.substr(4,1);
    
    achievementList[achievementId]["check1"] = check1;
    achievementList[achievementId]["check2"] = check2;
    achievementList[achievementId]["check3"] = check3;
    achievementList[achievementId]["check4"] = check4;
    achievementList[achievementId]["check5"] = check5;
    
    console.log(localStorageAchievementItemCheckKey + " <- " + localStorageAchievementItemCheckValue);
    
    localStorage.setItem(localStorageAchievementItemCheckKey, localStorageAchievementItemCheckValue);
    
  });
  
});

// ----------------------------------------------------------------
// Functions

// ----------------------------------------------------------------
// 検索を実行
function runSearchData() {
  
  addDataErrorCount = 0;
  var searchPerm = true;
  
  temp_appname = $('#appname').val();
  temp_profilename = $('#profilename').val();
  
  deleteDataError();
  
  // 入力欄判定
  if (temp_appname.length === 0){
    searchPerm = false;
    addDataError("Game nameを入力してください");
  }
  if (temp_profilename.length === 0){
    searchPerm = false;
    addDataError("Profile nameを入力してください");
  }
  
  appname = temp_appname;
  profilename = temp_profilename;
  
  // 検索の実行
  if (!searchPerm) {
    console.log("Data search NG");
    return;
  }
  
  searchData();
  
}

// ----------------------------------------------------------------
// 検索
function searchData(){
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
  $.get('php/getAchievementXML.php', {appname:appname, profilename:profilename}, function(achievementXML){
    console.log("Get achievement xml");
    console.log("\t" + appname + " for " + profilename);
    // console.log(achievementXML);
    
    // 準備
    var achievements = $(achievementXML).find("achievements").find("achievement");
    var achievementsLength = achievements.length;
    
    // 存在確認
    if (achievementsLength === 0){
      console.log("Load faild");
      addDataError("実績情報の読み込みに失敗しました");
      $.get('php/deleteAchievementXML.php', {appname:appname, profilename:profilename}, function(deleteAchievementXML){
        
        if (deleteAchievementXML) {
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
    
    // 実績リストを初期化
    clearAchievementList();
    
    // ゲーム名の表示
    var gameName = $(achievementXML).find("game").find("gameName").text();
    $(".achievement-appname").text(gameName);
    
    // ゲームロゴの表示とリンク
    var appIconPath = $(achievementXML).find("game").find("gameLogo").text();
    var appLink = $(achievementXML).find("game").find("gameLink").text();
    $(".achievement-appicon > img").attr("src", appIconPath);
    $(".achievement-appicon").attr("href", appLink);
    
    // ajax ユーザーを取得
    $.get('php/getUserXML.php', {profilename:profilename}, function(profileXML){
      console.log("Get user xml");
      console.log("\t" + profilename);
      // console.log(profileXML);
      
      // ユーザー名の表示
      var userName = $(profileXML).find("steamID").text();
      $(".achievement-profilename").text(userName);
      
      // アバターの表示とリンク
      var userIconPathList = $(profileXML).find("avatarMedium");
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
    
    // 結果を表示
    $(".achievement-search-result").text("Result: " + achievementCount);
    
    achievementCount = 0;
    var exitFlg = "false";
    
    // ajax 実績画像を取得
    console.log("Get achievement image");
    achievements.each(function() {
      $.get('php/getAchievementImage.php', {appname:appname, profilename:profilename, achievementCount:achievementCount, exitFlg:exitFlg}, function(achievementItemXML){
        // console.log($(achievementItemXML).find("id").text() + ": " + achievementItemXML);
        
        // アイコンパス
        var achievementItemIconPath;
        if ($(achievementItemXML).find("closed").text() === "1") {
          achievementItemIconPath = $(achievementItemXML).find("iconClosed").text();
        } else {
          achievementItemIconPath = $(achievementItemXML).find("iconOpen").text();
        }
        
        // console.log($(achievementItemXML).find("id").text() + ": " + $(achievementItemXML).find("closed").text());
        
        // achievementCount は非同期で先に回っちゃうから、
        // 別にXML側に用意した achievementItemId を確保
        var achievementItemId = $(achievementItemXML).find("id").text();
        var achievementItemSelector = "#achievement-item-" + achievementItemId + " .achievement-item-icon";
        
        // アイコンを設定
        $(achievementItemSelector).attr("src", achievementItemIconPath);
        $(achievementItemSelector).attr("alt", "achievement icon");
        
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
// 実績をフィルタ
function filterAchievement(_queryString){
  var queryString = _queryString || "";
  var achievementCount = 0;
  var visibleAchievementCount = 0;
  
  var queryList = queryString.split(" ");
  
  console.log(queryList);
  
  // 実績ごとにフィルタリング
  $(achievementList).each(function() {
    // console.log(this);
    var achievementItem = this;
    var achievementVisible;
    
    // 論理演算子ごとに初期化
    if (achievementSearchType === "OR") {
      achievementVisible = false;
    } else if (achievementSearchType === "AND") {
      achievementVisible = true;
    } else if (achievementSearchType === "NOR") {
      achievementVisible = true;
    } else if (achievementSearchType === "NAND") {
      achievementVisible = false;
    }
    
    // クエリごとにフィルタリング
    if (queryList[0].length === 0){
      achievementVisible = true;
    } else {
      $(queryList).each(function() {
        var query = this.toLowerCase();
        var visible = false;
        
        // 中身がなければ次のへ
        if (query.length === 0) {
          return true;
        }
        
        // 否定（!）があればスイッチして否定（!）を消す
        if (query.charAt(0) === "!") {
          visible = toggleBoolean(visible);
          query = query.substr(1);
        }
        
        if (query.indexOf("$c1") === 0) {
          if (achievementItem["check1"] === "t") {
            visible = toggleBoolean(visible);
          }
        } else if (query.indexOf("$c2") === 0) {
          if (achievementItem["check2"] === "t") {
            visible = toggleBoolean(visible);
          }
        } else if (query.indexOf("$c3") === 0) {
          if (achievementItem["check3"] === "t") {
            visible = toggleBoolean(visible);
          }
        } else if (query.indexOf("$c4") === 0) {
          if (achievementItem["check4"] === "t") {
            visible = toggleBoolean(visible);
          }
        } else if (query.indexOf("$c5") === 0) {
          if (achievementItem["check5"] === "t") {
            visible = toggleBoolean(visible);
          }
        } else if (query.indexOf("$c") === 0) {
          if (achievementItem["achieved"] === "t") {
            visible = toggleBoolean(visible);
          }
        } else {
          if (achievementItem["name"].toLowerCase().indexOf(query) > -1) {
            visible = toggleBoolean(visible);
          } else if (achievementItem["unlockTimestamp"].toLowerCase().indexOf(query) > -1) {
            visible = toggleBoolean(visible);
          } else if (achievementItem["description"].toLowerCase().indexOf(query) > -1) {
            visible = toggleBoolean(visible);
          } else if (achievementItem["memo"].toLowerCase().indexOf(query) > -1) {
            visible = toggleBoolean(visible);
          }
        }
        
        // 論理演算制御
        if (achievementSearchType === "OR") {
          if (visible) {
            achievementVisible = true;
            return false;
          }
        } else if (achievementSearchType === "AND") {
          if (!visible) {
            achievementVisible = false;
            return false;
          }
        } else if (achievementSearchType === "NOR") {
          if (visible) {
            achievementVisible = false;
            return false;
          }
        } else if (achievementSearchType === "NAND") {
          if (!visible) {
            achievementVisible = true;
            return false;
          }
        }
      });
      
    }
    
    // フラグに合わせて処理
    if (achievementVisible) {
      $("#achievement-item-" + achievementCount).removeClass("filtering");
      visibleAchievementCount++;
    } else {
      $("#achievement-item-" + achievementCount).addClass("filtering");
    }
    
    achievementCount++;
    
  });
  
  // 結果を表示
  $(".achievement-search-result").text("Result: " + visibleAchievementCount);
  
}

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
  achievementCount = _achievementCount || 0;
  
  // 値を取得
  var achievementAchieved = "f";
  
  var achievementTimestamp = "Lock";
  if ($(_achievementItem).attr("closed") === "1") {
    var unlockDate = new Date(1000 * $(_achievementItem).find("unlockTimestamp").text());
    achievementTimestamp = getDateString(unlockDate);
    achievementAchieved = "t";
  } 
  
  var achievementName = $(_achievementItem).find("name").text();
  var achievementDescription = $(_achievementItem).find("description").text();
  
  // ローカルストレージからメモとチェック状況を読み込み
  var tempKey = "";
  tempKey += "samAI";
  tempKey += "-" + appname;
  tempKey += "-" + profilename;
  tempKey += "-" + achievementCount;
  
  // メモ
  var localStorageAchievementItemMemoKey = tempKey + "-m";
  
  var localStorageAchievementItemMemoValue = localStorage.getItem(localStorageAchievementItemMemoKey);
  if (localStorageAchievementItemMemoValue === null) {
    localStorageAchievementItemMemoValue = "";
  } else {
    console.log(localStorageAchievementItemMemoKey + " -> " + localStorageAchievementItemMemoValue);
    
  }
  
  // console.log(localStorageAchievementItemMemoKey + " -> " + localStorageAchievementItemMemoValue);
  
  // チェック
  var localStorageAchievementItemCheckKey = tempKey + "-c";
  
  var localStorageAchievementItemCheckValue = localStorage.getItem(localStorageAchievementItemCheckKey);
  if (localStorageAchievementItemCheckValue === null) {
    localStorageAchievementItemCheckValue = "fffff";
  } else {
    console.log(localStorageAchievementItemCheckKey + " -> " + localStorageAchievementItemCheckValue);
    
  }
  
  var check1 = localStorageAchievementItemCheckValue.substr(0,1);
  var check2 = localStorageAchievementItemCheckValue.substr(1,1);
  var check3 = localStorageAchievementItemCheckValue.substr(2,1);
  var check4 = localStorageAchievementItemCheckValue.substr(3,1);
  var check5 = localStorageAchievementItemCheckValue.substr(4,1);
  
  // 実績リストに実績を追加
  achievementList[achievementCount] = {
    "name": achievementName,
    "achieved": achievementAchieved,
    "unlockTimestamp": achievementTimestamp,
    "description": achievementDescription,
    "memo": localStorageAchievementItemMemoValue,
    "check1": check1,
    "check2": check2,
    "check3": check3,
    "check4": check4,
    "check5": check5
  };
  
  if (check1 === "t") {
    check1 = " checked";
  } else {
    check1 = "";
  }
  if (check2 === "t") {
    check2 = " checked";
  } else {
    check2 = "";
  }
  if (check3 === "t") {
    check3 = " checked";
  } else {
    check3 = "";
  }
  if (check4 === "t") {
    check4 = " checked";
  } else {
    check4 = "";
  }
  if (check5 === "t") {
    check5 = " checked";
  } else {
    check5 = "";
  }
  
  
  if (inputSwitchFlg) {
    return '<div class="achievement-item" id="achievement-item-' + achievementCount + '" data-id="' + achievementCount + '"><img alt="achievement icon loading..." class="achievement-item-icon"><div class="achievement-item-top"><h3 class="achievement-item-title">' + achievementName + '</h3><p class="achievement-item-timestamp">' + achievementTimestamp + '</p></div><p class="achievement-item-desc">' + achievementDescription + '</p><div class="achievement-item-edit-area"><div class="achievement-item-memo"><textarea rows="1" placeholder="Enter notes" class="form-control achievement-item-memo-text">' + localStorageAchievementItemMemoValue + '</textarea></div><div class="input-group achievement-item-checkboxes"><label class="input-group-addon achievement-item-checkbox-area"><input type="checkbox" class="achievement-item-checkbox-1"' + check1 + '></label><label class="input-group-addon achievement-item-checkbox-area"><input type="checkbox" class="achievement-item-checkbox-2"' + check2 + '></label><label class="input-group-addon achievement-item-checkbox-area"><input type="checkbox" class="achievement-item-checkbox-3"' + check3 + '></label><label class="input-group-addon achievement-item-checkbox-area"><input type="checkbox" class="achievement-item-checkbox-4"' + check4 + '></label><label class="input-group-addon achievement-item-checkbox-area"><input type="checkbox" class="achievement-item-checkbox-5"' + check5 + '></label></div></div></div>';
  }
  
  return '<div class="achievement-item" id="achievement-item-' + achievementCount + '" data-id="' + achievementCount + '"><img alt="achievement icon loading..." class="achievement-item-icon"><div class="achievement-item-top"><h3 class="achievement-item-title">' + achievementName + '</h3><p class="achievement-item-timestamp">' + achievementTimestamp + '</p></div><p class="achievement-item-desc">' + achievementDescription + '</p></div>';
  
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
  
  var arrayOfHistoryValue;
  
  var appname = _appname || "defaultApp";
  var profilename = _profilename || "defaultUser";
  
  // 履歴に追加
  var localStorageActiveKey = appname + ":" + profilename;
  var localStorageHistoryValue = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
  console.log(LOCAL_STORAGE_HISTORY_KEY + " -> " + localStorageHistoryValue);
  
  // 履歴が存在する場合は整形
  if (localStorageHistoryValue != null) {
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
  
  console.log(LOCAL_STORAGE_HISTORY_KEY + " <- " + localStorageHistoryValue);
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
    console.log(LOCAL_STORAGE_HISTORY_KEY + " -> " + localStorageHistoryValue);
  
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
// 通常モーダルウィンドウ
function showDialog(_dialogTitle, _dialogContent) {
  var dialogTitle = _dialogTitle || "タイトル";
  var dialogContent = _dialogContent || "内容";
  
  // モーダルウィンドウを表示
  $("#modalDialog").html( dialogContent );
  $("#modalDialog").dialog({
    modal: true,
    title: dialogTitle
  });
}

// ----------------------------------------------------------------
// 確認モーダルウィンドウ
function showConfirmDialog(_dialogTitle, _dialogContent, _callbackFunction) {
  var dialogTitle = _dialogTitle || "確認";
  var dialogContent = _dialogContent || "内容";
  var callbackFunction = _callbackFunction || function(){};
  
  // モーダルウィンドウを表示
  $("#modalConfirmDialog").html( dialogContent );
  $("#modalConfirmDialog").dialog({
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

// ----------------------------------------------------------------
// 実績リストの初期化
function clearAchievementList() {
  achievementList = [];
}

// ----------------------------------------------------------------
// true false をスイッチ
function toggleBoolean(_bool) {
  return !_bool;
}
