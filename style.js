/*=================================
      INSPECTEURBOT RDC
      STYLE GLOBAL
==================================*/

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Poppins',sans-serif;
}

html{
    scroll-behavior:smooth;
}

body{
    background:#edf2f9;
    color:#222;
    overflow-x:hidden;
    min-height:100vh;
}

img{
    max-width:100%;
    display:block;
}

a{
    text-decoration:none;
}

button{
    font-family:'Poppins',sans-serif;
    cursor:pointer;
}

/*=================================
      LAYOUT
==================================*/

.dashboard-layout{
    display:flex;
    min-height:100vh;
}

/*=================================
      SIDEBAR
==================================*/

.sidebar{
    width:270px;
    background:linear-gradient(180deg,#04256f,#001845);
    color:#fff;
    position:fixed;
    top:0;
    left:0;
    height:100vh;
    padding:20px;
    overflow-y:auto;
    z-index:1000;
    scrollbar-width:none;
}

.sidebar::-webkit-scrollbar{
    display:none;
}

.sidebar-logo{
    text-align:center;
    margin-bottom:35px;
}

.sidebar-logo img{
    width:120px;
    margin:0 auto 15px;
}

.sidebar-logo h3{
    font-size:20px;
    font-weight:600;
}

.sidebar ul{
    list-style:none;
}

.sidebar ul li{
    margin-bottom:10px;
}

.sidebar ul li a{
    color:#fff;
    display:flex;
    align-items:center;
    gap:15px;
    padding:15px;
    border-radius:14px;
    transition:.3s;
    font-size:15px;
}

.sidebar ul li a:hover,
.sidebar ul li.active a{
    background:#0b52d6;
}

.sidebar ul li i{
    width:20px;
}

.logout{
    margin-top:40px;
}

.logout a{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:12px;
    background:#e21b23;
    color:#fff;
    padding:16px;
    border-radius:14px;
    font-weight:600;
    transition:.3s;
}

.logout a:hover{
    background:#c8141c;
}

/*=================================
      MAIN CONTENT
==================================*/

.main-content{
    flex:1;
    margin-left:270px;
    width:calc(100% - 270px);
    padding:25px;
}

/*=================================
      BANNER
==================================*/

.banner{
    position:relative;
    height:300px;
    border-radius:25px;
    overflow:hidden;
    margin-bottom:30px;
    box-shadow:0 15px 40px rgba(0,0,0,.20);
}

.banner-image{
    width:100%;
    height:100%;
    object-fit:cover;
}

.banner-overlay{
    position:absolute;
    inset:0;
    background:linear-gradient(
        rgba(0,43,120,.85),
        rgba(0,43,120,.70)
    );
}

.banner-content{
    position:absolute;
    inset:0;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:35px;
    color:#fff;
}

.banner-left{
    display:flex;
    align-items:center;
    gap:20px;
}

.banner-left img{
    width:110px;
    background:#fff;
    border-radius:50%;
    padding:6px;
}

.banner-left h1{
    font-size:46px;
    margin-bottom:10px;
}

.banner-left h3{
    color:#ffd43b;
    margin-bottom:12px;
    font-size:30px;
}

.banner-left p{
    max-width:650px;
    line-height:1.7;
}

.banner-right{
    display:flex;
    flex-direction:column;
    gap:15px;
}

.top-box{
    background:rgba(255,255,255,.15);
    backdrop-filter:blur(10px);
    padding:15px 20px;
    border-radius:15px;
    display:flex;
    align-items:center;
    gap:12px;
    animation:pulse 2s infinite;
}

.top-box i{
    font-size:20px;
}

/*=================================
      TITRES
==================================*/

.dashboard-section h2,
.quick-section h2,
.charts-section h2{
    color:#142c7a;
    margin-bottom:25px;
    font-size:28px;
}

/*=================================
      STATISTIQUES
==================================*/

.stats-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
    gap:20px;
}

.card{
    background:#fff;
    border-radius:20px;
    padding:25px;
    display:flex;
    align-items:center;
    gap:20px;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
    transition:.4s;
}

.card:hover{
    transform:translateY(-10px);
}

.card i{
    width:75px;
    height:75px;
    border-radius:18px;
    display:flex;
    justify-content:center;
    align-items:center;
    color:#fff;
    font-size:30px;
}

.card h3{
    font-size:18px;
    margin-bottom:8px;
}

.card h1{
    font-size:34px;
    color:#142c7a;
    font-weight:700;
}

.card p{
    color:#666;
}

/* Couleurs */

.blue{
    background:#0b52d6;
}

.green{
    background:#1eaa4b;
}

.orange{
    background:#ff9800;
}

.purple{
    background:#673ab7;
}

.cyan{
    background:#00acc1;
}

.dark{
    background:#08296d;
}

/*=================================
      ACCÈS RAPIDE
==================================*/

.quick-section{
    margin-top:40px;
}

.quick-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:20px;
}

.quick-card{
    background:#fff;
    padding:30px;
    border-radius:20px;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
    transition:.4s;
}

.quick-card:hover{
    transform:translateY(-10px);
}

.quick-card i{
    font-size:42px;
    color:#0b52d6;
    margin-bottom:20px;
}

.quick-card h3{
    color:#142c7a;
    margin-bottom:12px;
}

.quick-card p{
    color:#666;
    line-height:1.7;
    margin-bottom:20px;
}

.quick-card button{
    border:none;
    background:#0b52d6;
    color:#fff;
    padding:12px 30px;
    border-radius:12px;
    font-weight:600;
    transition:.3s;
}

.quick-card button:hover{
    background:#083ea5;
    transform:scale(1.05);
}

/*=================================
      GRAPHIQUES
==================================*/

.charts-section{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(420px,1fr));
    gap:25px;
    margin-top:40px;
}

.chart-box{
    background:#fff;
    padding:30px;
    border-radius:20px;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
    transition:.4s;
}

.chart-box:hover{
    transform:translateY(-10px);
}

.chart-box h3{
    color:#142c7a;
    margin-bottom:25px;
}

.chart-box canvas{
    width:100% !important;
    height:300px !important;
}

/*=================================
      DERNIÈRES INSPECTIONS
==================================*/

.inspection-list{
    background:#fff;
    padding:30px;
    border-radius:20px;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
    margin-top:40px;
}

.inspection-list h3{
    color:#142c7a;
    margin-bottom:25px;
}

.inspection-list table{
    width:100%;
    border-collapse:collapse;
}

.inspection-list td{
    padding:18px;
    border-bottom:1px solid #eee;
}

.success{
    background:#dff5e7;
    color:#178644;
    padding:8px 16px;
    border-radius:30px;
}

.warning{
    background:#fff0d8;
    color:#d18200;
    padding:8px 16px;
    border-radius:30px;
}

.danger{
    background:#ffe2e2;
    color:#cf2222;
    padding:8px 16px;
    border-radius:30px;
}

/*=================================
      FOOTER
==================================*/

.footer{
    text-align:center;
    padding:35px;
    color:#666;
}

/*=================================
      ANIMATIONS
==================================*/

@keyframes pulse{

    0%{
        transform:scale(1);
    }

    50%{
        transform:scale(1.03);
    }

    100%{
        transform:scale(1);
    }
}

/*=================================
      RESPONSIVE TABLETTE
==================================*/

@media(max-width:1000px){

    .dashboard-layout{
        flex-direction:column;
    }

    .sidebar{
        position:relative;
        width:100%;
        height:auto;
    }

    .main-content{
        margin-left:0;
        width:100%;
        padding:15px;
    }

    .banner{
        height:460px;
    }

    .banner-content{
        flex-direction:column;
        justify-content:center;
        text-align:center;
        gap:25px;
        padding:20px;
    }

    .banner-left{
        flex-direction:column;
    }

    .banner-left h1{
        font-size:34px;
    }

    .banner-left h3{
        font-size:24px;
    }
}

/*=================================
      RESPONSIVE MOBILE
==================================*/

@media(max-width:768px){

    .banner{
        height:520px;
    }

    .stats-grid,
    .quick-grid,
    .charts-section{
        grid-template-columns:1fr;
    }

    .banner-left img{
        width:90px;
    }

    .banner-left h1{
        font-size:28px;
    }

    .banner-left h3{
        font-size:20px;
    }

    .banner-left p{
        font-size:14px;
    }

    .card{
        flex-direction:column;
        text-align:center;
    }

    .inspection-list{
        overflow-x:auto;
    }
          }
