(this["webpackJsonpmama-library"]=this["webpackJsonpmama-library"]||[]).push([[0],{108:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(25),o=a.n(l),c=(a(78),a(9)),i=a(10),s=a(12),m=a(11),u=a(13),d=(a(79),a(20)),p=a(28),g=a.n(p),h=a(36),f=a(32),E=a.n(f),b=a(71),k=function(e){var t=e.itemsCount,a=e.pageSize,n=e.currentPage,l=e.onPageChange,o=Math.ceil(t/a);if(o<=1)return null;var c=Object(b.a)(Array(o).keys()).map((function(e){return e+1}));return r.a.createElement(r.a.Fragment,null,r.a.createElement("nav",{"aria-label":"Page navigation example"},r.a.createElement("ul",{className:"pagination"},c.map((function(e){return r.a.createElement("li",{key:e,className:e===n?"page-item active":"page-item"},r.a.createElement("a",{className:"page-link",onClick:function(){return l(e)}},e))})))))};var v=a(58),y=a(60),O=a(59),j=function(e){var t=e.liked,a=e.onClickToggle,n=O.a;return t&&(n=y.a),r.a.createElement(r.a.Fragment,null,r.a.createElement(v.a,{onClick:a,icon:n,style:{cursor:"pointer"}}))},S=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={redirect:!1},a}return Object(u.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.props,t=e.books,a=e.likedSet,n=e.onLike,l=e.onDelete,o=e.onSort,c=e.history,i=e.categories;return this.state.redirect?r.a.createElement(d.a,{to:this.state.redirect}):r.a.createElement("div",{className:"table-responsive"},r.a.createElement("table",{className:"table table-hover"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null),r.a.createElement("th",{className:"clickable",onClick:function(){return o("title")}},"Tytu\u0142"),r.a.createElement("th",{className:"clickable",onClick:function(){return o("author")}},"Autor(ka)"),r.a.createElement("th",null,"Kategoria"),r.a.createElement("th",null,"Ok\u0142adka"),r.a.createElement("th",null))),r.a.createElement("tbody",null,t.map((function(e){return r.a.createElement("tr",{className:"clickable",onClick:function(){return c.push("".concat("/MamaWebsiteFront","/books/").concat(e.title))},key:e.title},r.a.createElement("td",null,r.a.createElement(j,{liked:a.has(e.title),onClickToggle:function(){return n(e)}})),r.a.createElement("td",null,e.title),r.a.createElement("td",null,e.author),r.a.createElement("td",null,i.get(e.category)),r.a.createElement("td",null,r.a.createElement("img",{src:"data:image/jpeg;base64,".concat(e.image)})),r.a.createElement("td",null,r.a.createElement("button",{className:"btn btn-danger btn-sm",onClick:function(){return l(e)}},"X")))})))))}}]),t}(n.Component),N=function(e){var t=e.liked;return r.a.createElement(r.a.Fragment,null,r.a.createElement("h3",null,"Twoje polubione ksi\u0105\u017cki: "),r.a.createElement("ul",null,t.map((function(e){return r.a.createElement("li",{key:e.title},e.title)}))))},C=a(63),w=a.n(C),F=a(29),x=function(e){var t=e.categories,a=e.onFilter;return r.a.createElement(r.a.Fragment,null,r.a.createElement(F.a,{className:"m-3"},r.a.createElement(F.a.Toggle,{variant:"success",id:"dropdown-basic"},"Kategorie"),r.a.createElement(F.a.Menu,null,r.a.createElement(F.a.Item,{onClick:function(){return a(null)}},"Wszystkie"),t.map((function(e){return r.a.createElement(F.a.Item,{key:e.id,onClick:function(){return a(e.id)}},e.name)})))))},M=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={books:[],liked:[],likedSet:new Set,pageSize:2,currentPage:1,sortColumn:{name:"title",order:"asc"},categories:[],currentCategory:null,categories_lookup:new Map},a.handleDelete=function(e){console.log("Deleting"+e)},a.handleLike=function(e){var t=a.state.liked,n=a.state.likedSet;n.has(e.title)?(t=t.filter((function(t){return t.title!==e.title})),n.delete(e.title)):(t.push(e),n.add(e.title)),a.setState({liked:t,likedSet:n}),localStorage.setItem("likedBooks",JSON.stringify(t))},a.handlePageChange=function(e){a.setState({currentPage:e})},a.handleSort=function(e){var t=a.state.sortColumn;t.name===e?t.order="asc"===t.order?"desc":"asc":t={name:e,order:"asc"},a.setState({sortColumn:t})},a.handleFilter=function(e){console.log(e),a.setState({currentCategory:e})},a}return Object(u.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=Object(h.a)(g.a.mark((function e(){var t,n,r,l,o,c,i,s;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a(56),e.next=3,E.a.get(t.url+"books");case 3:return n=e.sent,r=n.data,e.next=7,E.a.get(t.url+"categories");case 7:l=e.sent,o=l.data,this.setState({books:r}),this.setState({categories:o}),c=new Map,o.map((function(e){return c.set(e.id,e.name)})),this.setState({categories_lookup:c}),i=null===localStorage.getItem("likedBooks")?[]:JSON.parse(localStorage.getItem("likedBooks")),s=new Set,i.map((function(e){return s.add(e.title)})),this.setState({liked:i,likedSet:s});case 18:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state,t=e.books,a=e.liked,n=e.likedSet,l=e.pageSize,o=e.currentPage,c=e.sortColumn,i=e.categories,s=e.currentCategory,m=e.categories_lookup,u=null!==s?t.filter((function(e){return e.category===s})):t,d=function(e,t,a){var n=(t-1)*a;return e.slice(n,n+a)}(w.a.orderBy(u,[c.name],[c.order]),o,l);return 0===t.length?r.a.createElement("div",null,r.a.createElement("h2",null,"\u0141adowanie...")):r.a.createElement(r.a.Fragment,null,r.a.createElement(x,{categories:i,onFilter:this.handleFilter}),r.a.createElement(S,{books:d,categories:m,likedSet:n,history:this.props.history,onLike:this.handleLike,onDelete:this.handleDelete,onSort:this.handleSort}),r.a.createElement(k,{itemsCount:t.length,pageSize:l,onPageChange:this.handlePageChange,currentPage:o}),r.a.createElement(N,{liked:a}))}}]),t}(n.Component),A=a(112),D=a(113),P=a(111),W=a(70),z=function(e){function t(){return Object(c.a)(this,t),Object(s.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(A.a,{sticky:"top",bg:"light",expand:"lg"},r.a.createElement(A.a.Brand,{href:"/"},"Biblioteka"),r.a.createElement(A.a.Toggle,{"aria-controls":"basic-navbar-nav"}),r.a.createElement(A.a.Collapse,{id:"basic-navbar-nav"},r.a.createElement(D.a,{className:"mr-auto"},r.a.createElement(D.a.Link,{href:"/MamaWebsiteFront/books"},"Ksi\u0105\u017cki")),r.a.createElement(P.a,{inline:!0},r.a.createElement(W.a,{variant:"outline-dark",href:"/MamaWebsiteFront/admin"},"Panel adminki")))))}}]),t}(n.Component),B=a(72),L=(n.Component,function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={categories:[]},a.handleAdd=function(e){e.preventDefault(),console.log("DODAWANKO")},a}return Object(u.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=Object(h.a)(g.a.mark((function e(){var t,n,r;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=a(56),e.next=3,E.a.get(t.url+"categories");case 3:n=e.sent,r=n.data,this.setState({categories:r});case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state.categories;return r.a.createElement(r.a.Fragment,null,r.a.createElement("form",{onSubmit:this.handleAdd},r.a.createElement("div",{className:"form-group"},r.a.createElement("label",null,"Tytu\u0142"),r.a.createElement("input",{className:"form-control"})),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",null,"Autor(ka)"),r.a.createElement("input",{className:"form-control"})),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",null,"Link"),r.a.createElement("input",{className:"form-control"})),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",null,"Lokalizacja"),r.a.createElement("input",{className:"form-control"})),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",null,"Ilo\u015b\u0107 egzemplarzy"),r.a.createElement("input",{className:"form-control"})),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",{htmlFor:"exampleFormControlSelect1"},"Example select"),r.a.createElement("select",{className:"form-control",id:"exampleFormControlSelect1"},e.map((function(e){return r.a.createElement("option",{key:e.id},e.name)})),r.a.createElement("option",null,"Dodaj kategori\u0119..."))),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",{htmlFor:"exampleFormControlTextarea1"},"Opis ksi\u0105\u017cki"),r.a.createElement("textarea",{className:"form-control",rows:"3"})),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",null,"Zdj\u0119cie ok\u0142adki"),r.a.createElement("input",{type:"file",className:"form-control-file"})),r.a.createElement("button",{type:"submit",className:"btn btn-primary"},"Dodaj")))}}]),t}(n.Component)),T=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={logged_in:!1},a.handleLogin=function(){a.setState({logged_in:!0})},a}return Object(u.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement(L,null)}}]),t}(n.Component),I=function(e){return r.a.createElement("h2",null,"Szczeg\xf3\u0142y ",e.match.params.title)},J=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},a}return Object(u.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return console.log("Pupa pupa","/MamaWebsiteFront"),r.a.createElement(r.a.Fragment,null,r.a.createElement(z,null),r.a.createElement("main",{className:"container m-3"},r.a.createElement(d.d,null,r.a.createElement(d.b,{path:"/MamaWebsiteFront/books/:title",component:I}),r.a.createElement(d.b,{path:"/MamaWebsiteFront/books",exact:!0,component:M}),r.a.createElement(d.b,{path:"/MamaWebsiteFront/admin",component:T}),r.a.createElement(d.a,{from:"/MamaWebsiteFront/",exact:!0,to:NaN}))))}}]),t}(n.Component),_=a(30);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(106),a(107);o.a.render(r.a.createElement(_.a,null,r.a.createElement(J,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},56:function(e){e.exports=JSON.parse('{"url":"https://us-central1-mamusialibrary.cloudfunctions.net/app/"}')},73:function(e,t,a){e.exports=a(108)},78:function(e,t,a){},79:function(e,t,a){}},[[73,1,2]]]);
//# sourceMappingURL=main.f3091846.chunk.js.map