/* JQuery-component */

class JQueryWeatherButton extends React.Component {
    getCoordinate(){
        $.get('/coordinate-data', function(data){
          alert("The first coordinate is " + data[-1]);
        });
    }
    render() {
        return <button onClick={this.getCoordinate}>
                 Get Coordinate with JQuery
               </button>
    }
}
/* End-JQuery-component */
