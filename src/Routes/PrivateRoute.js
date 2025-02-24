import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Layout from "../Components/Layout";
import PageNotFound from "../Components/PageNotFound";
import { closeModal } from "../Redux/Layout/layoutSlice";

import POSInterface from "../Pages/POS/Posui";

const PrivateRoute = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleRefresh = () => dispatch(closeModal());
    window.addEventListener("beforeunload", handleRefresh);
    return () => window.removeEventListener("beforeunload", handleRefresh);
  }, [dispatch]);

  return (
    <Suspense fallback="">
      <Layout>
        <Switch>
          {/* Sidebar related routes */}
          <Route exact path="/" component={POSInterface} />
          {/* <ProtectedRoute exact path="/" component={Dashboard} permission="" /> */}
          {/* <ProtectedRoute
            exact
            path="/client-registration"
            component={Loan}
            permission={PERMISSIONS?.loanInfo.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/collateral-inspection"
            component={Inspection}
            permission={PERMISSIONS.inspection.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/buisness-inspection"
            component={BusinessInspection}
            permission={PERMISSIONS?.businessInspection.all}
          /> */}
          {/* <ProtectedRoute exact path="/collection-and-recovery" component={CollectionAndRecovery} permission={PERMISSIONS?.recoveryCollectionLoan.all} /> */}
          {/* <ProtectedRoute
            exact
            path="/customer-details"
            component={CustomerDetails}
            permission={PERMISSIONS?.loanInfo.all}
          />{" "} */}
          {/* TODO: add permission */}
          {/* <ProtectedRoute
            exact
            path="/system-activity"
            component={SystemActivity}
            permission={PERMISSIONS?.systemActivity.all}
          /> */}
          {/* Settings related routes */}
          {/* <ProtectedRoute
            exact
            path="/department"
            component={DepartmentListing}
            permission={PERMISSIONS?.department.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/hierarchy"
            component={HierarchyListing}
            permission={PERMISSIONS?.user.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/collateral-questionnaires"
            component={AnnexTab}
            permission={PERMISSIONS?.annex.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/business-questionnaires"
            component={BusinessAnnexTab}
            permission={PERMISSIONS.businessInspectionAnnexure.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/core-setup"
            component={CoreSetupTabs}
            permission={PERMISSIONS?.organizationSetup.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/organization-setup"
            component={Organization}
            permission={PERMISSIONS.organizationSetup.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/country"
            component={Country}
            permission={PERMISSIONS.country.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/currency"
            component={Currency}
            permission={PERMISSIONS.currency.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/fiscalSessionAD"
            component={FiscalSessionAD}
            permission={PERMISSIONS?.fiscalSessionAD.all}
          /> */}
          {/* <ProtectedRoute
            exact
            path="/fiscalSessionBS"
            component={FiscalSessionBS}
            permission={PERMISSIONS?.fiscalSessionBS.all}
          />
          <ProtectedRoute
            exact
            path="/user-setup"
            component={UserTabs}
            permission={[""]}
          />
          <ProtectedRoute
            exact
            path="/user"
            component={User}
            permission={PERMISSIONS.user.all}
          />
          <ProtectedRoute
            exact
            path="/user-group"
            component={UserGroup}
            permission={PERMISSIONS.user.all}
          />
          <ProtectedRoute
            exact
            path="/loan-setup"
            component={LoanSetupTabs}
            permission={PERMISSIONS.loanInfo.all}
          />
          <ProtectedRoute
            exact
            path="/facility-type"
            component={Facilities}
            permission={PERMISSIONS.facilityType.all}
          />
          <ProtectedRoute
            exact
            path="/business-nature"
            component={BusinessNature}
            permission={PERMISSIONS.collateralType.all}
          />{" "} */}
          {/* TODO: add permission */}
          {/* <ProtectedRoute
            exact
            path="/collateral-type"
            component={CollateralType}
            permission={PERMISSIONS.collateralType.all}
          /> */}
          {/* <ProtectedRoute exact path="/change-password" component={ChangePassword} permission={PERMISSIONS?.user.all} /> */}
          <Route path="*" component={PageNotFound} />
        </Switch>
      </Layout>
    </Suspense>
  );
};

export default PrivateRoute;
