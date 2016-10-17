const Component = React.Component;

  class Msg extends Component {
    constructor(props){
      super(props)
    }
    render(){
      return (
          <div className="post">
            <div className="msg-id">{this.props.uid}</div>
            <div className="msg-content">{this.props.content}</div>
            <div className="msg-date">{this.props.date}</div>
          </div>

    );

    }
  }
  class MsgBoard extends Component {
    constructor(props){
      super(props)
    }
    render(){
      var children = [];
      var arr = this.props.data;
      for(var i=0;i<arr.length;i++)
        children.push(<Msg key={arr[i]._id} uid={arr[i].id} content={arr[i].content} date={(new Date(arr[i].timetag))
            .toLocaleString()}/>);
      children.reverse();
      return (
          <div>
            {children}
          </div>
      );

    }
  }

  //localStorage.clear();
//  dataStorage = JSON.parse(localStorage.getItem('latest5'));

  var id = document.getElementById('ID');
  var input = document.getElementById('CONTENT');
  var indicator = document.getElementById('indicator');
  var btn = document.getElementById('button');
  var bottom = document.getElementsByClassName('bottom')[0];
  var Indicator = React.createClass({
    propTypes: {
      txt: React.PropTypes.string.isRequired
    },
    render(){
      return (<div>{140 - this.props.txt.length}</div>)
    }
  });
  var time = 0;
  function post() {
    var _id = id.value;
    var content = input.value;
    var form = {content};
    if(!_id||!content){
      alert('请输入 ID 或内容');
      return;
    }

    fetch('/api/post/' + _id, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    }).then((res)=> {
      return res.json();
    });
  }
  function fetchAll() {
    fetch('/api/all')
        .then(r => {
          return r.json()
        })
        .then(t => {
          console.log(t)
        })
  }
  var dataStorage=new Array(0);
  try {
    var l = dataStorage.length;
    if (dataStorage[l-1])
      time = dataStorage[l-1].timetag;

    if(!time)
      time = 0;
  }
  catch (e){
    console.log(e);

  }


  function fetchLatest(t) {
    fetch('/api/latest/' + t)
        .then(r => {
          return r.json()
        })
        .then(t => {
              if (t.status) {


                if (dataStorage.length===0)
                  dataStorage = t.obj;
                else
                  if(t.obj){

                    dataStorage.push.apply(dataStorage,t.obj);
                  }


//                if (dataStorage.length <= 5)
//                  localStorage.setItem('latest5', JSON.stringify(dataStorage));
//                else
//                  localStorage.setItem('latest5', JSON.stringify(dataStorage.slice(-5)));
                var l = dataStorage.length;
                var d = dataStorage[l-1];

                time = d.timetag||t.obj[t.obj.length -1].timetag;
                //console.log(dataStorage.length+' '+d);

               // if(d)
               //   ReactDOM.render(<Msg uid={d.id} content={d.content} date={(new Date(d.timetag)).toLocaleString()}/>,bottom);
                if(dataStorage)
                  ReactDOM.render(<MsgBoard data={dataStorage}/>,bottom);
              }
              else {
                if (t.obj === "Empty") {
                  //do sth;

                }
              }
            }
        ).catch(e=>console.log(e)/*alert('Failed to fetch latest items.')*/);
  }

  btn.addEventListener('click', post);

  ReactDOM.render(<Indicator txt={input.value}/>, indicator);

  input.addEventListener('keyup', function () {
    ReactDOM.render(<Indicator txt={input.value}/>, indicator)
  });
  setInterval(()=> {
    fetchLatest(time)
  }, 1000);