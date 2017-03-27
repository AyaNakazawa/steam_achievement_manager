<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Steam Achievement Manager</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/font-awesome.min.css" rel="stylesheet">
    <link href="css/mystyle.css" rel="stylesheet">
  </head>
  <body>
    <header class="container-fluid" id="top">
      <h1><a href="#">Steam Achievement Manager</a></h1>
    </header>
    <nav class="navbar navbar-inverse">
    	<div class="container-fluid">
    		<div class="navbar-header">
    			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbarEexample1">
    				<span class="sr-only">Toggle navigation</span>
    				<span class="icon-bar"></span>
    				<span class="icon-bar"></span>
    				<span class="icon-bar"></span>
    			</button>
    		</div>
    		
    		<div class="collapse navbar-collapse" id="navbarEexample1">
    			<ul class="nav navbar-nav">
    				<li><a href="#">Reset</a></li>
    				<li><a href="#">History</a></li>
    			</ul>
    		</div>
    	</div>
    </nav>
    <div class="container-fluid main">
      <div class="data-search-area">
        <div class="data-search-form">
          <div class="data-error">
          </div>
          <div class="form-group data-profilename-text">
            <input type="text" id="profilename" placeholder="Please enter Profile Name" class="form-control" value="memoriamtk">
          </div>
          <div class="form-group data-appname-text">
            <input type="text" id="appname" placeholder="Please enter Game Name" class="form-control" value="aaa">
          </div>
          <div class="form-group data-search-button">
            <button type="button" id="data-search-submit" class="btn btn-primary"><i class="fa fa-search" aria-hidden="true"></i> Search</button>
          </div>
        </div>
      </div>
      <div class="achievement-area">
        <div class="achievement-info-area">
          <img src="img/test_logo.jpg" alt="game icon" class="achievement-appicon">
          <div class="achievement-top">
            <h2 class="achievement-appname">Game name</h3>
            <p class="achievement-profilename">User name</p>
          </div>
          <img src="img/test_user.jpg" alt="user icon" class="achievement-usericon">
        </div>
        <div class="achievement-search-area">
          <div class="input-group achievement-search-form">
            <span class="achievement-search-text">
              <input type="text" id="achievement-search" placeholder="Search achievements" class="form-control">
            </span>
          	<span class="input-group-btn achievement-search-button">
              <button type="button" id="achievement-search-submit" class="btn btn-default"><i class="fa fa-search" aria-hidden="true"></i></button>
          	</span>
          </div>
        </div>
        <div class="achievement-list-area">
          <div class="achievement-item">
            <img src="img/test_achievement.jpg" alt="achievement icon" class="achievement-item-icon">
            <div class="achievement-item-top">
              <h3 class="achievement-item-title">Achievement name</h3>
              <p class="achievement-item-timestamp">2016/08/08 11:23:45</p>
            </div>
            <p class="achievement-item-desc">desc. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello.</p>
            <div class="input-group">
            </div>
            <div class="input-group achievement-item-checkboxes">
              
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-1">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-2">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-3">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-4">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-5">
            	</label>
            </div>
          </div>
          <div class="achievement-item">
            <img src="img/test_achievement.jpg" alt="achievement icon" class="achievement-item-icon">
            <div class="achievement-item-top">
              <h3 class="achievement-item-title">Achievement name</h3>
              <p class="achievement-item-timestamp">2016/08/08 11:23:45</p>
            </div>
            <p class="achievement-item-desc">desc. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello.</p>
            <div class="input-group">
            </div>
            <div class="input-group achievement-item-checkboxes">
              
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-1">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-2">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-3">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-4">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-5">
            	</label>
            </div>
          </div>
          <div class="achievement-item">
            <img src="img/test_achievement.jpg" alt="achievement icon" class="achievement-item-icon">
            <div class="achievement-item-top">
              <h3 class="achievement-item-title">Achievement name</h3>
              <p class="achievement-item-timestamp">2016/08/08 11:23:45</p>
            </div>
            <p class="achievement-item-desc">desc. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello. hello.</p>
            <div class="input-group">
            </div>
            <div class="input-group achievement-item-checkboxes">
              
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-1">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-2">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-3">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-4">
            	</label>
            	<label class="input-group-addon achievement-item-checkbox-area">
            		<input type="checkbox" class="achievement-item-checkbox-5">
            	</label>
            </div>
          </div>
        </div>
      </div>
      <div class="pagetop"><a href="#top">PAGE TOP</a></div>
    </div>
    <footer class="container-fluid">
      <p>
        © 2017 <a href="https://github.com/AyaNakazawa/steam_achievement_manager" target="_blank">Steam Achievement Manager</a> @ <a href="https://github.com/AyaNakazawa/" alt="Aya Nakazawa Github" target="_blank">Aya Nakazawa</a>
      </p>
    </footer>
    <div class="container-fluid debug"></div>
    
    <script src="js/jquery-3.2.0.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/myscript.js"></script>
  </body>
</html>
