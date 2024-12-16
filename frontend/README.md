# Common Approach Sandbox Frontend
---
## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Structure](#structure)
---
## Introduction
The frontend uses React.js as the framework and primarily leverages MaterialUI for its theming.

---
## Installation
### Install dependencies
```shell
npm install -g yarn
yarn install
```

#### Start Frontend
```shell
yarn start
```

#### Build Frontend
```shell
yarn build
```

#### Serve built frontend
```shell
npx serve -s ./build
```
---
## Structure
All files and folders use PascalCase for naming.
The code building pages and components needed to build pages are in folder src/components. Most of pages are folded by their catogaries. For example, Dashboards.js and the buttons on the dashboard NavButton.js are in the src/component/dashboard. Moreover, AddEditImpactRisk.js(addEditImpactRisk page) and ImpactRisks(List of Impact Risks page) are in src/components/impactRisk

- `src/`
  - `components/`: contains the core code for building pages and the reusable components needed for those pages. Most pages and their associated components are organized into subfolders by category for better modularity and maintainability.
    
    - `ReportGenerate/`: This folder includes various components dedicated to generating different types of reports and managing their related data.
      - `CharacteristicReports.js`: Component responsible for generating and displaying characteristic-based data.
      - `CodeReports.js`: Component for generating and displaying code-based data.
      - `GroupMembers.js`: Component for generating and displaying organization members in groups.
      - `ImpactReports.js`: Component for generating and showing impactReport-based data.
      - `IndicatorReports.js`: Component for generating and displaying indicator-based data.
      - `OutcomeReports.js`: Component for generating and displaying outcome-based data.
      - `ReportTypesPage.js`: Component serving as a page to list and select various report types.
      - `StakeholderOutcomeReports.js`: Component for generating and displaying stakeholderOutcome-based data.
      - `ThemeReport.js`: Component for generating and displaying theme-based data.
    
    - `characteristics/`: This folder organizes components related to displaying and managing characteristics.
      - `AddEditCharacteristic.js`: A page component for creating and updating one characteristic.
      - `Characteristic.js`: A component representing a single characteristic record or view.
      - `CharacteristicView.js`: A component displaying a detailed view of a characteristic.
      - `Characteristics.js`: A component listing and managing multiple characteristics.
    
    - `codes/`: This folder organizes components related to displaying and managing codes.
      - `AddEditCode.js`: Component for adding or editing one code.
      - `Code.js`: Component representing an individual code.
      - `CodeView.js`: Component displaying a detailed view of a particular code.
      - `Codes.js`: A component listing and managing multiple codes.
     
    - `counterfactual/`: This folder organizes components related to displaying and managing counterfactuals.
      - `AddEditCounterfactual.js`: Component for adding or editing one counterfactual.
      - `Counterfactuals.js`: Component for listing and managing counterfactuals.
        
    - `dashboard/`: The dashboard folder includes components related to the dashboard page
      - `Dashboards.js`: The main component for rendering the dashboard page.
      - `NavButton.js`: A reusable button component for dashboard navigation. While primarily used in the dashboard, this component is designed for reuse across other navigation areas.
        
    - `dataDashboard/`: Components for displaying and managing data dashboards.
      - `DataDashboard.js`: Main component of the data dashboard page, featuring various types of graphs to visually represent the data.
        
    - `dataExport/`: Components related to data exporting functionality.
      - `dataExport.js`: Main component or module handling data export operations.
        
    - `datasets/`: This folder organizes components related to displaying and managing datasets.
      - `AddEditDataset.js`: Component for adding or editing one dataset.
      - `Datasets.js`: Component for listing and managing datasets.
        
    - `forgotPassword/`: Components related to password recovery functionality.
      - `ForgotPassword.js`: Component handling the "Forgot Password" page and logic.
      - `ResetPassword.js`: Component that provides the "Reset Password" functionality.
    
    - `groups/`: Components to manage and display groups.
      - `AddEditGroup.js`: Component for adding or editing one group.
      - `Groups.js`: Component to list and manage groups.
    
    - `howMuchImpact/`: Components focused on managing the How Much Impact.
      - `AddEditHowMuchImpact.js`: Component for creating or updating one How Much Impact.
      - `HowMuchImpacts.js`: Component listing HowMuchImpact.
    
    - `impactModels/`: Components dealing with impact model data.
      - `AddEditImpactModel.js`: Component for adding or editing one Impact Model.
      - `impactModels.js`: Component listing and managing Impact Models associated with a specific organization.
      - `organization-impactModel.js`: This component allows users to view and select from a list of organizations. Upon choosing an organization, users can seamlessly navigate to impactModels.js to explore further details.
    
    - `impactReport/`: Components related to generating and displaying impact reports.
      - `AddEditImpactReport.js`: Component for creating or updating one impact report.
      - `ImpactReport.js`: Component for a single impact report.
      - `ImpactReportView.js`: Component providing a detailed view of an impact report.
      - `ImpactReports.js`: Component for listing and managing impact reports.
      - `Organization-impactReport.js`: Component for organization-specific impact report details.
        
    - `impactRisk/`: The impactRisk folder contains components for managing and displaying impact risks
      - `AddEditImpactRisk.js`: A page component for adding or editing one impact risk.
      - `ImpactRisks.js`:  A page component for listing impact risks.

    - `indicatorReport/`: Components for managing and displaying indicator reports.
      - `AddEditIndicatorReport.js`: Component for creating or editing an indicator report.
      - `IndicatorReport.js`: Component representing a single indicator report.
      - `IndicatorReportView.js`: Component providing a detailed view of an indicator report.
      - `IndicatorReports.js`: Component for listing and managing indicator reports.
    
    - `indicators/`: Components for handling indicators and their related data.
      - `AddEditIndicator.js`: Component for adding or editing an indicator.
      - `Indicator.js`: Component representing a single indicator.
      - `IndicatorView.js`: Component providing a detailed view of an indicator.
      - `Indicators.js`: Component listing and managing indicators.
    
    - `layouts/`: Layout components that define the overall UI structure.
      - `Footer.js`: Layout component for the page footer.
      - `TopNavbar.js`: Layout component for the top navigation bar.
    
    - `login/`: Components associated with the login and authentication process.
      - `DoubleAuth.js`: Manages two-factor authentication, requiring the user to correctly answer one of three security questions set by themselves.
      - `LoginPane.js`: Provides the login interface where users can input their email and password.
      - `SuperPasswordPage.js`: The initial page encountered by the user, serving as an additional authentication step. Users must correctly enter the super password to proceed to the login pane.
    
    - `nodeGraph/`: Components related to displaying data in a node graph.
      - `nodeGraph.js`: Component that handles node graph visualization and interactions.
    
    - `organizations/`: Components for managing and displaying organizations.
      - `AddEditOrganization.js`: Component for adding or editing one organization.
      - `Organization.js`: Component representing a single organization’s data.
      - `OrganizationView.js`: Component providing a detailed view of an organization.
      - `Organizations.js`: Component listing and managing organizations.

    - `outcomes/`: Components for managing and displaying outcomes.
      - `AddEditOutcome.js`: Component for creating or updating an outcome.
      - `Outcome.js`: Component representing a single outcome.
      - `OutcomeView.js`: Component providing a detailed view of an outcome.
      - `Outcomes.js`: Component listing and managing outcomes.
    
    - `registration/`: Components related to user registration and onboarding.
      - `UserFirstEntry.js`: Component handling the first-time entry flow for new users.
      - `UserInvite.js`: Component to handle user invitations.
    
    - `routes/`: Utilities related to routing.
      - `PrivateRoute.js`: Utility that restricts routes to authenticated users only.
      - `RoutesForUserTypes.js`: Utility that defines different route configurations based on user roles or types.
    
    - `sankeyDiagram/`: Components for rendering Sankey diagrams.
      - `SankeyDiagram.js`: A component that gathers user requirements for a Sankey diagram and renders it accordingly.
     
    - `shared/`: Contains reusable components that can be utilized across various parts of the application.
      - `Table/`: Components for building tables.
        - `EnhancedTableHead.js`: A component for rendering a customizable table header, with sorting functionality.
        - `EnhancedTableToolbar.js`: A component providing toolbar actions for the table (e.g., filters).
        - `index.js`: Main export file that aggregates and re-exports table components.
        - `TR.js`: a Wrapper component for rendering table rows.
      
      - `dialogs/`: Common dialog components shared across the application.
        - `DeleteDialog.js`: A reusable confirmation dialog for deletion operations.
        - `Dialogs.js`: A main or higher-level component that manages and renders various dialogs.
      
      - `fields/`: A collection of field components that serve as building blocks for forms and data entry.
        - `AddressFieldField.js`: A component for handling address input fields.
        - `CSVUploadModal.js`: A component providing a modal interface for uploading CSV files.
        - `CounterFactualField.js`: A field component for managing counterfactual inputs.
        - `FileUploader.js`: A reusable component for uploading files.
        - `GeneralField.js`: A generic input field component that can be adapted for various inputs.
        - `ImpactReportField.js`: A specialized field component for impact reports.
        - `IndicatorReportField.js`: A field component dealing with indicator reports.
        - `MultiSelectField.js`: A component for selecting multiple options from a list.
        - `OutcomeField.js`: A component designed for inputting outcome-related data.
        - `RadioField.js`: A radio button field component for selecting a single option.
        - `SelectField.js`: A dropdown single select field for choosing one option from many.
        - `StakeholderOutcomeField.js`: A field component for managing stakeholder outcome inputs.
        - `URIFields.js`: A URI (or URL) input component.
        - `dataTypeGraph.js`: A visualization component showing data type relationship graphs.
        - `IndicatorField.js`: A component specialized for indicator inputs.
       
      - `DeleteModal.js`: A reusable modal component for confirming deletion actions.
      - `DropdownFilter.js`: A component for rendering a dropdown filter interface, enabling quick filtering of data.
      - `DropdownMenu.js`: A component that provides a dropdown menu for selecting actions and navigation.
      - `LoadingButton.js`: A button component that shows a loading spinner when an action is in progress.
      - `PasswordHint.js`: A component that displays password requirements or hints.
      - `index.js`: An index file that may re-export components from the `shared` directory for easier imports.

    - `stakeholderOutcome/`: Components for handling stakeholder outcomes.
      - `AddEditStakeholderOutcome.js`: Component for creating or editing stakeholder outcomes.
      - `StakeholderOutcomeView.js`: Component to display a detailed view of a single stakeholder outcome.
      - `StakeholderOutcomes.js`: Component listing and managing stakeholder outcomes associated with a specific organization.
      - `organization-stakeholderOutcome.js`: This component allows users to view and select from a list of organizations. Upon choosing an organization, users can seamlessly navigate to StakeholderOutcomes.js to explore further details.
      - `stakeholderOutcome.js`: A component representing a single stakeholder outcome.
    
    - `stakeholders/`: Components for managing and displaying stakeholders.
      - `AddEditStakeholder.js`: Component for adding or editing stakeholders.
      - `Stakeholder.js`: Component representing a single stakeholder.
      - `StakeholderView.js`: Component providing a detailed view of a stakeholder.
      - `Stakeholders.js`: Component listing and managing stakeholders.
    
    - `theme/`: Components related to theme management and presentation.
      - `AddEditTheme.js`: Component for adding or editing theme data.
      - `Theme.js`: Component representing a single theme.
      - `ThemeView.js`: Component providing a detailed view of a theme.
      - `Themes.js`: Component listing and managing themes.
    
    - `themeNetwork/`: Components related to theme networks(theme and subTheme Relationships).
      - `AddEditThemeNetwork.js`: Component for adding or editing a theme network.
      - `ThemeNetworkView.js`: Component providing a detailed view of a theme network.
      - `ThemeNetworks.js`: Component listing and managing theme networks.

    - `totalReviewPage/`: Components related to content in a summarized form.
      - `TotalReviewPage.js`: The main component for displaying all data grouped by organizations.
      - `TotalReviewPageView.js`: A detailed view component for the total review page.
      - `TotalReviewPages.js`: A component to list or manage multiple total review pages.
    
    - `uploadingPages/`: Components for handling pages or interfaces dedicated to uploading files or data.
      - `uploadingPage.js`: The main component for the uploading page.
    
    - `userProfile/`: Components related to managing and displaying user profile information.
      - `EditProfile.js`: Component for editing user profile details.
      - `Profile.js`: Component displaying a user's profile information.
      - `UserResetPassword.js`: Component for handling user password reset functionality.
      - `UserResetSecurityQuestion.js`: Component for resetting a user’s security question.
      - `changePrimaryEmail.js`: Component to allow users to change their primary email address.
    
    - `users/`: Components for managing user accounts, including listing users, editing user details, and related forms.
      - `EditUserForm.js`: A form component to edit an existing user's details.
      - `User.js`: Component representing a single user’s data.
      - `Users.js`: Component listing and managing multiple users.
      - `organizationUsers.js`: Component focusing on the management of users within a specific organization.
    
    - `Landing.js`: The main landing page component, the homepage after login.
    - `emailConfirm.js`: Component verifying new email addresses or signups.

  - `constants/`: A directory holding various configuration files and constants used throughout the application.
    - `default_fields.js`: Contains default field definitions and configurations used in forms or other components.
    - `forgot_password_fields.js`: Defines fields and settings for "forgot password" functionalities.
    - `index.js`: An index file that may aggregate and re-export constants from this folder for easier imports.
    - `login_double_auth_fields.js`: Fields and configurations related to login with double (two-factor) authentication.
    - `updatePasswordFields.js`: Fields and settings for updating a user's password.
    - `userFirstEntryFields.js`: Configurations for the fields presented to users on their first entry or onboarding.
    - `userProfileFields.js`: Field definitions for user profile data.

  - `context/`: A folder for React context providers or related logic that manages global state.
    - `index.js`: The main file that sets up and exports the application’s context.
    





