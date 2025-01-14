import React, {useContext} from 'react';
import {Link} from '../shared';

import {Container, Button, Typography} from "@mui/material";
import {
  Edit,
  People,
  FileUpload,
  Download,
  Summarize,
  AccountTree, Leaderboard
} from "@mui/icons-material";
import {UserContext} from "../../context";
import {NavButton} from "./NavButton";
import {useNavigate} from "react-router-dom";
import {navigateHelper} from "../../helpers/navigatorHelper";


function Dashboard() {
  const userContext = useContext(UserContext);
  const navigator = useNavigate();
  const navigate = navigateHelper(navigator)
  console.log(userContext)

  // if (userContext.userTypes.includes('superuser'))
  //   return <DashboardForSuperUser/>;

  return (
    <Container maxWidth="md" sx={{
      paddingTop: 8,
      textAlign: 'center',
    }}>

      {userContext.isSuperuser || userContext.groupAdminOfs.length?
        <NavButton to={`/groups`} icon={<People/>} key={'groups'}
                  text="Manage Groups"/>:null}

      {userContext.isSuperuser || userContext.groupAdminOfs.length || userContext.administratorOfs.length?
        <NavButton to={`/organizations`} icon={<People/>} key={'organizations'}
                  text="Manage Organizations"/>:
      null}

      <NavButton to={'/totalReviewPages'} icon={<Summarize/>} key={`totalReviewPages`}
                 text="Total Review Page"/>

      {userContext.isSuperuser?
        <NavButton to={`/stakeholders`} icon={<People/>} key={'stakeholders'}
                   text="Manage Stakeholders"/>:
        null}

      <NavButton to={`/organization-impactModels`} icon={<Edit/>} key={'impactModels'}
                 text="Manage Impact Models"/>

      {userContext.isSuperuser?
        <NavButton to={`/codes`} icon={<People/>} key={'codes'}
                   text="Manage Codes"/>:
        null}

      {userContext.isSuperuser?
        <NavButton to={`/characteristics`} icon={<People/>} key={'characteristic'}
                   text="Manage Characteristic"/>:
        null}

      {userContext.isSuperuser || userContext.administratorOfs.length?
        <NavButton to={userContext.isSuperuser?`/users`:`/organizationUsers`} icon={<People/>} key={'users'}
                  text="Manage Users"/>:null}

      <NavButton to={`/indicators`} icon={<Edit/>} key={'organization-indicators'}
                 text="Manage Indicators"/>

      <NavButton to={`/outcomes`} icon={<Edit/>} key={'organization-outcomes'}
                 text="Manage Outcomes"/>

      <NavButton to={`/indicatorReports`} icon={<Edit/>} key={'indicatorReports'}
                 text="Manage Indicator Reports"/>

      <NavButton to={`/themes`} icon={<Edit/>} key={'themes'}
                 text="Manage Themes"/>

      <NavButton to={`/themeNetworks`} icon={<Edit/>} key={'themeNetwork'}
                 text="Manage Theme Networks"/>

      <NavButton to={`/impactReports`} icon={<Edit/>} key={'impactReports'}
                 text="Manage Impact Reports"/>

      <NavButton to={`/organization-stakeholderOutcomes`} icon={<Edit/>} key={'stakeholderOutcomes'}
                 text="Manage Stakeholder Outcomes"/>

      <NavButton to={'/datasets'} icon={<Edit/>} key={`dataset`}
                 text="Manage Datasets"/>

      <NavButton to={'/impactRisks'} icon={<Edit/>} key={`impactRisk`}
                 text="Manage ImpactRisk"/>

      <NavButton to={'/counterfactuals'} icon={<Edit/>} key={`counterfactual`}
                 text="Manage Counterfactuals"/>

      <NavButton to={'/howMuchImpacts'} icon={<Edit/>} key={`howMuchImpacts`}
                 text="Manage HowMuchImpacts"/>


      {userContext.isSuperuser || userContext.editorOfs.length? <NavButton to={`/fileUploading`} icon={<FileUpload/>} key={'fileUploading'}
                                                                           text="File Upload"/>:null}

      <NavButton to={'/dataExport'} icon={<Download/>} key={`dataExport`}
                 text="Data Export"/>

      <NavButton to={'/reportGenerate'} icon={<Download/>} key={`reportGenerate`}
                 text="Reports"/>

      <NavButton to={'/nodeGraph'} icon={<AccountTree/>} key={`nodeGraph`}
                 text="Node Graph"/>

      <NavButton to={'/dataDashboard'} icon={<Leaderboard/>} key={`dataDashboard`}
                 text="Data Dashboard"/>

      <NavButton to={'/sankeyDiagram'} icon={<Summarize/>} key={`sankeyDiagram`}
                 text="Sankey Diagram"/>





      {/*<NavButton to={'/settings/manage-forms/client'} icon={<Edit/>}*/}
      {/*           text="Manage Forms"/>*/}


    </Container>);


}

export default Dashboard;
