import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import IndexPage from "./routes/IndexPage"
import Personal from "./routes/Personal"

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage}/>
        <Route path="/personal" exact component={Personal}/>
      </Switch>
    </Router>
  );
}

export default RouterConfig;
