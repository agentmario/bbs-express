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
  var dataStorage = [];
  localStorage.clear();
  dataStorage = JSON.parse(localStorage.getItem('latest5'));

  var id = document.getElementById('ID');
  var input = document.getElementById('CONTENT');
  var indicator = document.getElementById('indicator');
  var btn = document.getElementsByTagName('button')[0];
  var Indicator = React.createClass({
    propTypes: {
      txt: React.PropTypes.string.isRequired
    },
    render(){
      return (<div>{140 - this.props.txt.length}</div>)
    }
  });

  function post() {
    var _id = id.value;
    var content = input.value;
    var form = {content: content};
    fetch('/api/post/' + _id, {
      method: "POST",
      body: form
    }).then((res)=> {
      return res.json();
    }).then((txt)=>console.log(txt));
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
  var time = 0;
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


                if (dataStorage===null)
                  dataStorage = t.obj;
                else
                  dataStorage = dataStorage.concat(t.obj);

                if (dataStorage.length <= 5)
                  localStorage.setItem('latest5', JSON.stringify(dataStorage));
                else
                  localStorage.setItem('latest5', JSON.stringify(dataStorage.slice(-5)));
                var l = dataStorage.length;
                var d = dataStorage[l-1];

                time = t.obj[t.obj.length -1].timetag;


              }
              else {
                if (t.obj === "Empty") {
                  //do sth;
                  console.log("Empty");
                }
              }
            }
        ).catch(e=>console.log(e)/*alert('Failed to fetch latest items.')*/);
  }

  btn.addEventListener('click', post);

  ReactDOM.render(<Indicator txt={input.value}/>, indicator);
  var d = new Date(Date.now()).toLocaleString();
  ReactDOM.render(<Msg uid="adadafwfw" content="aaaaaaaaaa" date={d}/>,document.getElementsByClassName('bottom')[0]);
  input.addEventListener('keyup', function () {
    ReactDOM.render(<Indicator txt={input.value}/>, indicator)
  });
  setInterval(()=> {
    fetchLatest(time)
  }, 5000);
