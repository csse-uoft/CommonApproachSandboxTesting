import React from 'react';
import {Route, Routes} from 'react-router-dom';

// components
import Landing from './components/Landing';
import LoginPane from './components/login/LoginPane';
import Dashboard from './components/dashboard/Dashboard';
import changePrimaryEmail from './components/userProfile/changePrimaryEmail';
import Users from './components/users/Users';
import User from './components/users/User';
import UserForm from './components/users/UserForm';
import UserInvite from './components/registration/UserInvite';
import ResetPassword from './components/userProfile/UserResetPassword';
import UserResetSecurityQuestions from "./components/userProfile/UserResetSecurityQuestions";
import EmailConfirm from './components/emailConfirm';
import UserProfile from './components/userProfile/Profile';
import UpdateUserProfile from './components/userProfile/EditProfile';
import PrivateRoute from './components/routes/PrivateRoute';
import {SuperUserRoute} from './components/routes/RoutesForUserTypes';
import UserFirstEntry from "./components/registration/UserFirstEntry";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import ForgotPasswordResetPassword from "./components/forgotPassword/ResetPassword";
import DoubleAuth from "./components/login/DoubleAuth";
import Organizations from "./components/organizations/Organizations";
import AddEditOrganization from "./components/organizations/AddEditOrganization";
import EditUserForm from "./components/users/EditUserForm";
import Groups from "./components/groups/Groups";
import AddEditGroup from "./components/groups/AddEditGroup";
import Themes from "./components/theme/Themes";
import AddEditTheme from "./components/theme/AddEditTheme";
import Organization_indicators from "./components/indicators/Organization-indicators";
import Indicators from "./components/indicators/Indicators";
import AddEditIndicator from "./components/indicators/AddEditIndicator";
import Organization_outcomes from "./components/outcomes/Organization-outcomes";
import Outcomes from "./components/outcomes/Outcomes";
import AddEditOutcome from "./components/outcomes/AddEditOutcome";
import AddEditIndicatorReport from "./components/indicatorReport/AddEditIndicatorReport";
import Organization_indicatorReports from "./components/indicatorReport/Organization-indicatorReports";
import IndicatorReports from "./components/indicatorReport/IndicatorReports";
import FileUploadingPage from "./components/uploadingPages/uploadingPage";
import ReportTypesPage from "./components/ReportGenerate/ReportTypesPage";
import GroupMembers from "./components/ReportGenerate/GroupMembers";
import IndicatorReports_ReportGenerate from "./components/ReportGenerate/IndicatorReports";
import OutcomeReports from "./components/ReportGenerate/OutcomeReports";
import ThemeReports from "./components/ReportGenerate/ThemeReport";
import OrganizationUsers from "./components/users/organizationUsers";
import SuperPassword from "./components/SuperPasswordPage";
import Stakeholders from "./components/stakeholders/Stakeholders";
import AddEditStakeholder from "./components/stakeholders/AddEditStakeholder";
import AddEditCode from "./components/codes/AddEditCode";
import Codes from "./components/codes/Codes";
import Code from "./components/codes/Code";
import AddEditCharacteristic from "./components/characteristics/AddEditCharacteristic";
import Characteristic_ReportGenerate from "./components/ReportGenerate/CharacteristicReports";
import Code_ReportGenerate from "./components/ReportGenerate/CodeReports";
import StakeholderOutcomeReports from "./components/ReportGenerate/StakeholderOutcomeReport";
import AddEditStakeholderOutcome from "./components/stakeholderOutcome/AddEditStakeholderOutcome";
import ImpactReports_ReportGenerate from "./components/ReportGenerate/ImpactReports";
import AddEditImpactReport from "./components/impactReport/AddEditImpactReport";
import Organization_impactReports from "./components/impactReport/Organization-impactReports";
import ImpactReports from "./components/impactReport/ImpactReports";
import Organization_stakeholderOutcomes from "./components/stakeholderOutcome/organization-stakeholderOutcomes";
import StakeholderOutcomes from "./components/stakeholderOutcome/StakeholderOutcomes";
import AddEditDataset from "./components/datasets/AddEditDataset";
import Organization_impactModels from "./components/impactModels/organization-impactModels";
import ImpactModels from "./components/impactModels/impactModels";
import AddEditImpactModel from "./components/impactModels/AddEditImpactModel";
import AddEditCounterfactual from "./components/counterfactual/AddEditCounterfactual";
import AddEditImpactRisk from "./components/impactRisk/AddEditImpactRisk";
import ImpactRisks from "./components/impactRisk/ImpactRisks";
import Counterfactuals from "./components/counterfactual/Counterfactuals";
import Datasets from "./components/datasets/Datasets";
import AddEditHowMuchImpact from "./components/howMuchImpact/AddEditHowMuchImpact";
import HowMuchImpacts from "./components/howMuchImpact/HowMuchImpacts";
import Characteristic from './components/characteristics/Characteristic';
import Characteristics from "./components/characteristics/Characteristics";
import Organization from "./components/organizations/Organization";
import Indicator from "./components/indicators/Indicator";
import Outcome from "./components/outcomes/Outcome";
import Theme from "./components/theme/Theme";


const routes = (
  <Routes>
    {/*basic*/}
    <Route exact path={`${process.env.PUBLIC_URL}/`} element={<Landing/>}/>
    <Route path={`${process.env.PUBLIC_URL}/login/doubleAuth`} element={<DoubleAuth/>}/>
    <Route path={`${process.env.PUBLIC_URL}/login/superPassword`} element={<SuperPassword/>}/>
    <Route path={`${process.env.PUBLIC_URL}/login`} element={<LoginPane/>}/>
    <Route path={`${process.env.PUBLIC_URL}/dashboard`} element={<PrivateRoute element={Dashboard}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/verify/:token`} element={<UserFirstEntry/>}/>
    <Route path={`${process.env.PUBLIC_URL}/forgot-password`} element={<ForgotPassword/>}/>
    {/*users*/}
    <Route path={`${process.env.PUBLIC_URL}/users`} element={<PrivateRoute element={Users}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/organizationOfUsers/:organizationURI`}
           element={<PrivateRoute element={Users}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/organizationUsers`} element={<PrivateRoute element={OrganizationUsers}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/users/invite`} element={<PrivateRoute element={UserInvite}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/users/:uri/edit`} element={<PrivateRoute element={UpdateUserProfile}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/users/:uri`} element={<PrivateRoute element={EditUserForm}/>}/>

    {/*organization*/}
    <Route path={`${process.env.PUBLIC_URL}/organizations`} element={<PrivateRoute element={Organizations}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/organizations/new`}
           element={<PrivateRoute element={AddEditOrganization}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/organization/:uri/view`}
           element={<PrivateRoute element={Organization}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/organization/:uri/:viewMode`}
           element={<PrivateRoute element={AddEditOrganization}/>}/>
    {/*stakeholders*/}
    <Route path={`${process.env.PUBLIC_URL}/stakeholders`} element={<PrivateRoute element={Stakeholders}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/stakeholder/new`} element={<PrivateRoute element={AddEditStakeholder}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/stakeholder/:uri/:viewMode`}
           element={<PrivateRoute element={AddEditStakeholder}/>}/>

    {/*Codes*/}
    <Route path={`${process.env.PUBLIC_URL}/codes`} element={<PrivateRoute element={Codes}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/code/new`} element={<PrivateRoute element={AddEditCode}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/code/:uri/view`} element={<PrivateRoute element={Code}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/code/:uri/:viewMode`} element={<PrivateRoute element={AddEditCode}/>}/>


    {/*Datasets*/}
    <Route path={`${process.env.PUBLIC_URL}/dataset/new`} element={<PrivateRoute element={AddEditDataset}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/datasets`} element={<PrivateRoute element={Datasets}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/dataset/:uri/:viewMode`}
           element={<PrivateRoute element={AddEditDataset}/>}/>

    {/*Datasets*/}
    <Route path={`${process.env.PUBLIC_URL}/howMuchImpact/new`}
           element={<PrivateRoute element={AddEditHowMuchImpact}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/howMuchImpacts`} element={<PrivateRoute element={HowMuchImpacts}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/howMuchImpact/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditHowMuchImpact}/>}/>

    {/*ImpactRisk*/}
    <Route path={`${process.env.PUBLIC_URL}/impactRisks`} element={<PrivateRoute element={ImpactRisks}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactRisk/new`} element={<PrivateRoute element={AddEditImpactRisk}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactRisk/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditImpactRisk}/>}/>


    {/*Characteristic*/}
    <Route path={`${process.env.PUBLIC_URL}/characteristics`} element={<PrivateRoute element={Characteristics}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/characteristic/new`}
           element={<PrivateRoute element={AddEditCharacteristic}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/characteristic/:uri/:viewMode`}
           element={<PrivateRoute element={AddEditCharacteristic}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/characteristic/:uri/view`} element={<PrivateRoute element={Characteristic}/>}/>


    {/*Groups*/}
    <Route path={`${process.env.PUBLIC_URL}/groups`} element={<PrivateRoute element={Groups}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/groups/new`} element={<PrivateRoute element={AddEditGroup}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/groups/:uri/:viewMode`} element={<PrivateRoute element={AddEditGroup}/>}/>

    {/*profile*/}
    <Route path={`${process.env.PUBLIC_URL}/profile/:uri/edit`} element={<PrivateRoute element={UpdateUserProfile}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/profile/:uri`} element={<PrivateRoute element={UserProfile}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/profile/reset-password/:uri`}
           element={<PrivateRoute element={ResetPassword}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/profile/reset-securityQuestions/:id`}
           element={<PrivateRoute element={UserResetSecurityQuestions}/>}/>
    {/*theme*/}
    <Route path={`${process.env.PUBLIC_URL}/themes`} element={<PrivateRoute element={Themes}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/theme/new`} element={<PrivateRoute element={AddEditTheme}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/theme/:uri/:operationMode`}
           element={<PrivateRoute element={Theme}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/theme/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditTheme}/>}/>
    {/*indicators*/}
    <Route path={`${process.env.PUBLIC_URL}/organization-indicators`}
           element={<PrivateRoute element={Organization_indicators}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicators/:uri`} element={<PrivateRoute element={Indicators}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicator/:orgUri/new`}
           element={<PrivateRoute element={AddEditIndicator}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicator/new`} element={<PrivateRoute element={AddEditIndicator}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicator/:uri/view`}
           element={<PrivateRoute element={Indicator}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicator/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditIndicator}/>}/>
    {/*outcomes*/}
    <Route path={`${process.env.PUBLIC_URL}/organization-outcomes`}
           element={<PrivateRoute element={Organization_outcomes}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/outcomes/:uri`} element={<PrivateRoute element={Outcomes}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/outcome/:orgUri/new`} element={<PrivateRoute element={AddEditOutcome}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/outcome/new`} element={<PrivateRoute element={AddEditOutcome}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/outcome/:uri/view`}
           element={<PrivateRoute element={Outcome}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/outcome/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditOutcome}/>}/>

    {/*stakeholderOutcome*/}
    <Route path={`${process.env.PUBLIC_URL}/organization-stakeholderOutcomes`}
           element={<PrivateRoute element={Organization_stakeholderOutcomes}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/stakeholderOutcome/new`}
           element={<PrivateRoute element={AddEditStakeholderOutcome}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/stakeholderOutcome/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditStakeholderOutcome}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/stakeholderOutcomes/:uri`}
           element={<PrivateRoute element={StakeholderOutcomes}/>}/>

    {/*impactReport*/}
    <Route path={`${process.env.PUBLIC_URL}/organization-impactReports`}
           element={<PrivateRoute element={Organization_impactReports}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactReports/:uri`} element={<PrivateRoute element={ImpactReports}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactReport/new`} element={<PrivateRoute element={AddEditImpactReport}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactReport/:orgUri/new`}
           element={<PrivateRoute element={AddEditImpactReport}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactReport/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditImpactReport}/>}/>

    {/*impactModel*/}
    <Route path={`${process.env.PUBLIC_URL}/organization-impactModels`}
           element={<PrivateRoute element={Organization_impactModels}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactModel/new`}
           element={<PrivateRoute element={AddEditImpactModel}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactModel/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditImpactModel}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/impactModels/:uri`} element={<PrivateRoute element={ImpactModels}/>}/>

    {/*file uploading page*/}
    <Route path={`${process.env.PUBLIC_URL}/fileUploading`} element={<PrivateRoute element={FileUploadingPage}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/fileUploading/:orgUri/:fileType`}
           element={<PrivateRoute element={FileUploadingPage}/>}/>


    <Route path={`${process.env.PUBLIC_URL}/organization-indicatorReports`}
           element={<PrivateRoute element={Organization_indicatorReports}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicatorReports/:uri`}
           element={<PrivateRoute element={IndicatorReports}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicatorReport/new`}
           element={<PrivateRoute element={AddEditIndicatorReport}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicatorReport/:orgUri/new`}
           element={<PrivateRoute element={AddEditIndicatorReport}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/indicatorReport/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditIndicatorReport}/>}/>


    <Route path={`${process.env.PUBLIC_URL}/email-confirm`} element={<EmailConfirm/>}/>

    <Route path={`${process.env.PUBLIC_URL}/update-primary-email/:token`} element={<changePrimaryEmail/>}/>

    <Route path={`${process.env.PUBLIC_URL}/resetPassword/:token`}
           element={<PrivateRoute element={ForgotPasswordResetPassword}/>}/>


    <Route path={`${process.env.PUBLIC_URL}/users/reset-securityQuestions/:id`}
           element={<PrivateRoute element={UserResetSecurityQuestions}/>}/>


    <Route path={`${process.env.PUBLIC_URL}/users/new`} element={<SuperUserRoute element={UserForm}/>}/>

    <Route path={`${process.env.PUBLIC_URL}/users/:id`} element={<SuperUserRoute element={User}/>}/>

    {/*reportGenerate*/}
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate`} element={<PrivateRoute element={ReportTypesPage}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate/groupMembers`}
           element={<PrivateRoute element={GroupMembers}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate/indicatorReports`}
           element={<PrivateRoute element={IndicatorReports_ReportGenerate}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate/outcomeReports`}
           element={<PrivateRoute element={OutcomeReports}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate/themeReports`}
           element={<PrivateRoute element={ThemeReports}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate/characteristicReports`}
           element={<PrivateRoute element={Characteristic_ReportGenerate}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate/codeReports`}
           element={<PrivateRoute element={Code_ReportGenerate}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate/stakeholderOutcomeReports`}
           element={<PrivateRoute element={StakeholderOutcomeReports}/>}/>
    <Route path={`${process.env.PUBLIC_URL}/reportGenerate/impactReports-reports`}
           element={<PrivateRoute element={ImpactReports_ReportGenerate}/>}/>


    {/*Counterfactual*/}
    <Route
      path={`${process.env.PUBLIC_URL}/counterfactuals`}
      element={<PrivateRoute element={Counterfactuals}/>}/>
    <Route
      path={`${process.env.PUBLIC_URL}/counterfactual/new`}
      element={<PrivateRoute element={AddEditCounterfactual}/>}/>

    <Route path={`${process.env.PUBLIC_URL}/counterfactual/:uri/:operationMode`}
           element={<PrivateRoute element={AddEditCounterfactual}/>}/>

  </Routes>
);

export default routes;
