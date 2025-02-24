import React, { lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Suspense } from "react";
import POSInterface from "../Pages/POS/Posui";
import Login from "../Pages/Login";

const PublicRoute = () => {
  return (
    <>
      <Suspense fallback={""}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Redirect from="*" to="/" />
        </Switch>
      </Suspense>
    </>
  );
};

export default PublicRoute;
