import React, { lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Suspense } from "react";
import POSInterface from "../Pages/POS/Posui";

const PublicRoute = () => {
  return (
    <>
      <Suspense fallback={""}>
        <Switch>
          <Route exact path="/" component={POSInterface} />
          <Redirect from="*" to="/" />
        </Switch>
      </Suspense>
    </>
  );
};

export default PublicRoute;
