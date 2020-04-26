import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';

import Page from '../src/Page.jsx';
import template from './template.js';
import store from '../src/store.js';
import routes from '../src/routes.js';


async function render(req, res) {
    const activeRoute = routes.find(
        route => matchPath(req.path, route)
    );

    let initialData;
    if (activeRoute && activeRoute.component.fetchData) {

        // get the this.props.match to find the /edit/2 id from url, and send with fetchData function
        const match = matchPath(req.path, activeRoute);

        const index = req.url.indexOf('?');
        console.log(index);
        const search = index !== -1 ? req.url.substr(index) : null;

        initialData = await activeRoute.component.fetchData(match, search);
    }
    const context = {};
    const element = (
        <StaticRouter location={req.url} context={context}>
            <Page />
        </StaticRouter>
    );
    const body = ReactDOMServer.renderToString(element);

    if (context.url) {
        res.redirect(301, context.url);
    } else {
        res.send(template(body, initialData));
    }
}

export default render;