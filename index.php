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
    			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbarTop">
    				<span class="sr-only">Toggle navigation</span>
    				<span class="icon-bar"></span>
    				<!-- <span class="icon-bar"></span> -->
    				<span class="icon-bar"></span>
    			</button>
    		</div>
    		
    		<div class="collapse navbar-collapse" id="navbarTop">
    			<ul class="nav navbar-nav">
    				<li class="action-reset"><a><i class="fa fa-times" aria-hidden="true"></i> Reset</a></li>
    				<!-- <li class="action-history"><a><i class="fa fa-server" aria-hidden="true"></i> History</a></li> -->
    				<li class="action-reload"><a><i class="glyphicon glyphicon-refresh"></i> Reload</a></li>
    			</ul>
    		</div>
    	</div>
    </nav>
    <div class="container-fluid main">
      <div class="data-search-area">
        <div class="data-search-form">
          <div class="data-error">
          </div>
          <div class="form-group data-form data-profilename-text">
            <input type="text" id="profilename" placeholder="Please enter Profile Name" class="form-control" value="">
          </div>
          <div class="form-group data-form data-appname-text">
            <input type="text" id="appname" placeholder="Please enter Game Name" class="form-control" value="">
          </div>
          <div class="form-group data-form data-search-button">
            <button type="button" id="data-search-submit" class="btn btn-primary"><i class="fa fa-search" aria-hidden="true"></i> Search</button>
          </div>
        </div>
      </div>
      
    </div>
    <footer class="container-fluid">
      <p ="footer-text">
        © 2017 <a href="https://github.com/AyaNakazawa/steam_achievement_manager" target="_blank">Steam Achievement Manager</a> @ <a href="https://github.com/AyaNakazawa/" alt="Aya Nakazawa Github" target="_blank">Aya Nakazawa</a>
      </p>
    </footer>
    <div class="container-fluid debug"></div>
    
    <script src="js/jquery-3.2.0.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/myscript.js"></script>
  </body>
</html>
