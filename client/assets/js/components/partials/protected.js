"use strict";

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Login from "../user/login";
import Title from "./title";
import Messages from "./messages";
import Breadcrumbs from "./breadcrumbs";

@connect(
    state => ({
        user: state.user
    })
)
export default class AuthenticatedComponent extends Component {

    static displayName = "Protected";

    static propTypes = {
        user: PropTypes.object,
        children: React.PropTypes.element.isRequired,
        params: PropTypes.object,
        roles: PropTypes.array,
        location: PropTypes.object
    };

    static defaultProps = {
        user: null,
        roles: []
    };

    constructor() {
        super(...arguments);
        this.constructor.displayName = this.props.params.displayName;
    }

    componentWillMount() {
        this.setState({
            roles: this.props.params.roles
        });
    }

    componentWillUnmount() {
        this.setState({
            roles: []
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.roles !== nextProps.params.roles) {
            if (!nextProps.params.roles) {
                this.setState({
                    roles: this.props.params.roles
                });
            } else {
                this.setState({
                    roles: nextProps.params.roles
                });
            }
        }
    }

    pleaseLogin() {
        return (
            <Login location={this.props.location}/>
        );
    }

    checkRole() {
        if (this.props.user === null) {
            return false;
        }
        return this.state.roles.some(role => {
            return role === this.props.user.role;
        });
    }

    render() {
        const allowed = this.checkRole();
        return (
            <div className="container">
                <Breadcrumbs {...this.props}/>
                <Title {...this.props}/>
                <Messages/>
                {!allowed ? this.pleaseLogin() : this.props.children}
            </div>
        );
    }
}
