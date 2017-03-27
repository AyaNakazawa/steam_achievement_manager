
var addDataErrorCount = 0;

$(function() {
  
  // ローカルストレージ対応判定
  if(!localStorage) {
    alert('ローカルストレージに対応していないため、データを保存できません');
  }
  
  // dataの検索
  $('#data-search-submit').click(function() {
    console.log("data search click");
    
    addDataErrorCount = 0;
    var searchPerm = true;
    
    var profilename = $('#profilename').val();
    var appname = $('#appname').val();
    
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
      console.log("data search start");
      
      $.get('php/getUserXML.php', {profilename:profilename}, function(data){
        console.log(data);
      });
      
      $.get('php/getAchievementXML.php', {profilename:profilename, appname:appname}, function(data){
        console.log(data);
      });
      
    } else {
      console.log("data search NG");
      
    }
    
  });
  
  // # アンカーのスクロール
  $('a[href^="#"]').click(function() {
    console.log("# scroll");
    var speed = 600;
    var position = $($(this).attr("href")).offset().top;
    $('body,html').animate({scrollTop:position}, speed);
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
