"use strict";

/* class-start */
class Die extends React.Component {

    constructor(props) {
        super(props);
        this.state = {result: "?"};

        this.roll = this.roll.bind(this);
    }

    roll() {
        var num = Math.ceil(
            Math.random() * this.props.sides);
        this.setState({result: num});
    }

    render() {
        return (
            <button className="die" onClick={ this.roll }>
                <i>d{ this.props.sides }</i>
                <b>{ this.state.result }</b>
            </button>
        );
    }
}
/* class-end */

/* main-start */
ReactDOM.render(
    <div>
        <Die sides="4" />
        <Die sides="6" />
        <Die sides="8" />
        <Die sides="10" />
        <Die sides="12" />
        <Die sides="20" />
    </div>,
    document.getElementById("root")
);
/* main-end */
