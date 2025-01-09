# Common Approach Sandbox Frontend

---
## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Structure](#structure)
---
## Introduction

### Framework: React.js

React.js serves as the core framework for the frontend of the Common Approach Sandbox. This JavaScript library was chosen for its powerful component-based architecture, which facilitates the creation of reusable UI components and ensures a consistent user experience. React.js also excels in maintaining performance through its virtual DOM, enabling efficient updates and rendering.

### Styling and Theming: MaterialUI

To achieve a cohesive and visually appealing design, the project leverages MaterialUI (MUI) for theming and component styling. MaterialUI provides a rich set of pre-designed components adhering to Google's Material Design principles, ensuring a modern and professional look and feel. It also simplifies the process of customizing themes to align with specific branding requirements.

### Programming Language: JavaScript

JavaScript serves as the primary programming language for the frontend development. Its flexibility and vast ecosystem make it an ideal choice for building interactive and dynamic user interfaces. JavaScript’s compatibility with React.js ensures seamless integration and enables the use of modern ES6+ features for cleaner and more efficient code.

### Visualization: 

#### SankeyDiagram.js

The Sankey Diagram in the project is built using D3.js within the SankeyDiagram.js module. D3.js is a powerful JavaScript library for creating dynamic and interactive data visualizations. By leveraging D3.js, the project ensures that the Sankey Diagram is both visually compelling and capable of representing complex data flows effectively. Additionally, D3.js allows users to specify the position of nodes in relation to their respective columns, providing greater control and customization over the layout and structure of the diagram. However, the current implementation does not provide an option for users to specify the color of the flows or nodes, which may be considered for future enhancements.

#### Cytoscape

The project also uses Cytoscape to generate node graphs within the NodeGraph.js module. Cytoscape provides a highly customizable framework for visualizing networks, allowing users to modify the colour and position of nodes and edges. Users can also remove or omit specific nodes from the graph, offering flexibility to tailor the visualization to their needs. This feature enables a more interactive and personalized experience, making it easier to analyze complex relationships within the graph.

---
## Installation
#### Install dependencies
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

The source code for building pages and their components is located in the `src/components` folder. Most pages are organized by their respective categories. For example, `Dashboards.js` and the dashboard navigation button `NavButton.js` are found in `src/components/dashboard`. Additionally, `AddEditImpactRisk.js` (the Add/Edit Impact Risk page) and `ImpactRisks.js` (the Impact Risks listing page) reside in `src/components/impactRisk`.

- `src/`
  - `components/`: Contains the core code for building pages and the reusable components required for those pages. Most pages and their associated components are organized into subfolders by category for enhanced modularity and maintainability.
    
    - `ReportGenerate/`: Includes various components dedicated to generating different types of reports and managing their related data.
      - `CharacteristicReports.js`: Generates and displays characteristic-based data.
      - `CodeReports.js`: Generates and displays code-based data.
      - `GroupMembers.js`: Generates and displays organization members in groups.
      - `ImpactReports.js`: Generates and displays impact report-based data.
      - `IndicatorReports.js`: Generates and displays indicator-based data.
      - `OutcomeReports.js`: Generates and displays outcome-based data.
      - `ReportTypesPage.js`: Lists and allows selection of various report types.
      - `StakeholderOutcomeReports.js`: Generates and displays stakeholder outcome-based data.
      - `ThemeReport.js`: Generates and displays theme-based data.
    
    - `characteristics/`: Organizes components related to displaying and managing characteristics.
      - `AddEditCharacteristic.js`: Creates and updates a single characteristic.
      - `Characteristic.js`: Represents a single characteristic record or view.
      - `CharacteristicView.js`: Displays a detailed view of a characteristic.
      - `Characteristics.js`: Lists and manages multiple characteristics.
    
    - `codes/`: Organizes components related to displaying and managing codes.
      - `AddEditCode.js`: Adds or edits a single code.
      - `Code.js`: Represents an individual code.
      - `CodeView.js`: Displays a detailed view of a specific code.
      - `Codes.js`: Lists and manages multiple codes.
     
    - `counterfactual/`: Organizes components related to displaying and managing counterfactuals.
      - `AddEditCounterfactual.js`: Adds or edits a single counterfactual.
      - `Counterfactuals.js`: Lists and manages counterfactuals.
        
    - `dashboard/`: Includes components related to the dashboard page.
      - `Dashboards.js`: Renders the main dashboard page.
      - `NavButton.js`: A reusable button component for dashboard navigation, also designed for use in other navigation areas.
        
    - `dataDashboard/`: Components for displaying and managing data dashboards.
      - `DataDashboard.js`: Renders the data dashboard page with various graphs to visually represent data.
        
    - `dataExport/`: Components related to data exporting functionality.
      - `DataExport.js`: Handles data export operations.
        
    - `datasets/`: Organizes components related to displaying and managing datasets.
      - `AddEditDataset.js`: Adds or edits a single dataset.
      - `Datasets.js`: Lists and manages datasets.
        
    - `forgotPassword/`: Components related to password recovery functionality.
      - `ForgotPassword.js`: Manages the "Forgot Password" page and logic.
      - `ResetPassword.js`: Provides the "Reset Password" functionality.
    
    - `groups/`: Components for managing and displaying groups.
      - `AddEditGroup.js`: Adds or edits a single group.
      - `Groups.js`: Lists and manages groups.
    
    - `howMuchImpact/`: Components focused on managing "How Much Impact."
      - `AddEditHowMuchImpact.js`: Creates or updates a single "How Much Impact."
      - `HowMuchImpacts.js`: Lists "How Much Impact" entries.
    
    - `impactModels/`: Components dealing with impact model data.
      - `AddEditImpactModel.js`: Adds or edits a single Impact Model.
      - `ImpactModels.js`: Lists and manages Impact Models associated with specific organizations.
      - `OrganizationImpactModel.js`: Allows users to view and select organizations, then navigate to `ImpactModels.js` for detailed exploration.
    
    - `impactReport/`: Components related to generating and displaying impact reports.
      - `AddEditImpactReport.js`: Creates or updates a single impact report.
      - `ImpactReport.js`: Represents a single impact report.
      - `ImpactReportView.js`: Provides a detailed view of an impact report.
      - `ImpactReports.js`: Lists and manages impact reports.
      - `OrganizationImpactReport.js`: Displays organization-specific impact report details.
        
    - `impactRisk/`: Contains components for managing and displaying impact risks.
      - `AddEditImpactRisk.js`: Adds or edits a single impact risk.
      - `ImpactRisks.js`: Lists impact risks.
    
    - `indicatorReport/`: Components for managing and displaying indicator reports.
      - `AddEditIndicatorReport.js`: Creates or edits an indicator report.
      - `IndicatorReport.js`: Represents a single indicator report.
      - `IndicatorReportView.js`: Provides a detailed view of an indicator report.
      - `IndicatorReports.js`: Lists and manages indicator reports.
    
    - `indicators/`: Components for handling indicators and related data.
      - `AddEditIndicator.js`: Adds or edits an indicator.
      - `Indicator.js`: Represents a single indicator.
      - `IndicatorView.js`: Provides a detailed view of an indicator.
      - `Indicators.js`: Lists and manages indicators.
    
    - `layouts/`: Layout components that define the overall UI structure.
      - `Footer.js`: Renders the page footer.
      - `TopNavbar.js`: Renders the top navigation bar.
    
    - `login/`: Components associated with the login and authentication process.
      - `DoubleAuth.js`: Manages two-factor authentication by requiring users to answer one of three security questions.
      - `LoginPane.js`: Provides the login interface for users to input their email and password.
      - `SuperPasswordPage.js`: An additional authentication step where users must enter a super password to access the login pane.
    
    - `nodeGraph/`: Components related to displaying data in a node graph.
      - `NodeGraph.js`: Handles node graph visualization and interactions.
    
    - `organizations/`: Components for managing and displaying organizations.
      - `AddEditOrganization.js`: Adds or edits a single organization.
      - `Organization.js`: Represents a single organization's data.
      - `OrganizationView.js`: Provides a detailed view of an organization.
      - `Organizations.js`: Lists and manages organizations.
    
    - `outcomes/`: Components for managing and displaying outcomes.
      - `AddEditOutcome.js`: Creates or updates an outcome.
      - `Outcome.js`: Represents a single outcome.
      - `OutcomeView.js`: Provides a detailed view of an outcome.
      - `Outcomes.js`: Lists and manages outcomes.
    
    - `registration/`: Components related to user registration and onboarding.
      - `UserFirstEntry.js`: Handles the first-time entry flow for new users.
      - `UserInvite.js`: Manages user invitations.
    
    - `routes/`: Utilities related to routing.
      - `PrivateRoute.js`: Restricts routes to authenticated users only.
      - `RoutesForUserTypes.js`: Defines route configurations based on user roles or types.
    
    - `sankeyDiagram/`: Components for rendering Sankey diagrams.
      - `SankeyDiagram.js`: Gathers user requirements and renders Sankey diagrams accordingly.
     
    - `shared/`: Contains reusable components utilized across various parts of the application.
      - `Table/`: Components for building tables.
        - `EnhancedTableHead.js`: Renders a customizable table header with sorting functionality.
        - `EnhancedTableToolbar.js`: Provides toolbar actions for the table, such as filters.
        - `Index.js`: Aggregates and exports table components.
        - `TR.js`: A wrapper component for rendering table rows.
      
      - `dialogs/`: Common dialog components shared across the application.
        - `DeleteDialog.js`: A reusable confirmation dialog for deletion operations.
        - `Dialogs.js`: Manages and renders various dialogs.
      
      - `fields/`: A collection of field components serving as building blocks for forms and data entry.
        - `AddressField.js`: Handles address input fields.
        - `CSVUploadModal.js`: Provides a modal interface for uploading CSV files.
        - `CounterFactualField.js`: Manages counterfactual inputs.
        - `FileUploader.js`: A reusable component for uploading files.
        - `GeneralField.js`: A generic input field adaptable for various inputs.
        - `ImpactReportField.js`: A specialized field for impact reports.
        - `IndicatorReportField.js`: Handles indicator report inputs.
        - `MultiSelectField.js`: Allows selection of multiple options from a list.
        - `OutcomeField.js`: Designed for inputting outcome-related data.
        - `RadioField.js`: A radio button field for selecting a single option.
        - `SelectField.js`: A dropdown field for choosing one option from many.
        - `StakeholderOutcomeField.js`: Manages stakeholder outcome inputs.
        - `URIFields.js`: Handles URI or URL inputs.
        - `DataTypeGraph.js`: Visualizes data type relationship graphs.
        - `IndicatorField.js`: Specialized for indicator inputs.
       
      - `DeleteModal.js`: A reusable modal for confirming deletion actions.
      - `DropdownFilter.js`: Renders a dropdown filter interface for quick data filtering.
      - `DropdownMenu.js`: Provides a dropdown menu for selecting actions and navigation.
      - `LoadingButton.js`: A button that displays a loading spinner during actions.
      - `PasswordHint.js`: Displays password requirements or hints.
      - `Index.js`: Aggregates and exports components from the `shared` directory for easier imports.
    
    - `stakeholderOutcome/`: Components for handling stakeholder outcomes.
      - `AddEditStakeholderOutcome.js`: Creates or edits stakeholder outcomes.
      - `StakeholderOutcomeView.js`: Displays a detailed view of a single stakeholder outcome.
      - `StakeholderOutcomes.js`: Lists and manages stakeholder outcomes associated with specific organizations.
      - `OrganizationStakeholderOutcome.js`: Allows users to view and select organizations, then navigate to `StakeholderOutcomes.js` for detailed exploration.
      - `StakeholderOutcome.js`: Represents a single stakeholder outcome.
    
    - `stakeholders/`: Components for managing and displaying stakeholders.
      - `AddEditStakeholder.js`: Adds or edits stakeholders.
      - `Stakeholder.js`: Represents a single stakeholder.
      - `StakeholderView.js`: Provides a detailed view of a stakeholder.
      - `Stakeholders.js`: Lists and manages stakeholders.
    
    - `theme/`: Components related to theme management and presentation.
      - `AddEditTheme.js`: Adds or edits theme data.
      - `Theme.js`: Represents a single theme.
      - `ThemeView.js`: Provides a detailed view of a theme.
      - `Themes.js`: Lists and manages themes.
    
    - `themeNetwork/`: Components related to theme networks (theme and sub-theme relationships).
      - `AddEditThemeNetwork.js`: Adds or edits a theme network.
      - `ThemeNetworkView.js`: Provides a detailed view of a theme network.
      - `ThemeNetworks.js`: Lists and manages theme networks.
    
    - `totalReviewPage/`: Components related to summarized content.
      - `TotalReviewPage.js`: Displays all data grouped by organizations.
      - `TotalReviewPageView.js`: Provides a detailed view of the total review page.
      - `TotalReviewPages.js`: Lists and manages multiple total review pages.
    
    - `uploadingPages/`: Components for handling file or data uploads.
      - `UploadingPage.js`: Manages the uploading interface.
    
    - `userProfile/`: Components related to managing and displaying user profile information.
      - `EditProfile.js`: Edits user profile details.
      - `Profile.js`: Displays a user's profile information.
      - `UserResetPassword.js`: Handles user password reset functionality.
      - `UserResetSecurityQuestion.js`: Resets a user’s security question.
      - `ChangePrimaryEmail.js`: Allows users to change their primary email address.
    
    - `users/`: Components for managing user accounts, including listing users, editing user details, and related forms.
      - `EditUserForm.js`: Edits an existing user's details.
      - `User.js`: Represents a single user’s data.
      - `Users.js`: Lists and manages multiple users.
      - `OrganizationUsers.js`: Manages users within a specific organization.
    
    - `Landing.js`: The main landing page component displayed after login.
    - `EmailConfirm.js`: Verifies new email addresses or signups.
  
  - `constants/`: Contains various configuration files and constants used throughout the application.
    - `default_fields.js`: Defines default field configurations used in forms and components.
    - `forgot_password_fields.js`: Configures fields and settings for "Forgot Password" functionalities.
    - `index.js`: Aggregates and exports constants from this folder for easier imports.
    - `login_double_auth_fields.js`: Configures fields related to double (two-factor) authentication during login.
    - `updatePasswordFields.js`: Defines fields and settings for updating a user's password.
    - `userFirstEntryFields.js`: Configures fields presented to users during their first entry or onboarding.
    - `userProfileFields.js`: Defines fields for user profile data.
  
  - `context/`: Manages React context providers and global state logic.
    - `index.js`: Sets up and exports the application’s context.
  
  - `helpers/`: A collection of utility functions, configuration files, and helper modules that assist various parts of the application.
    - `schemas/`: Contains JSON schema files that define the structure and validation rules for specific data types.
      - `indicator.json`: Defines the structure and validation rules for indicators.
      - `outcome.json`: Outlines the structure and validation requirements for outcomes.
      - `theme.json`: Describes the structure and rules for themes.
  
    - `attributeConfig.js`: Handles attribute configurations for different data types.
    - `deletingObjectHelper.js`: Assists with deleting objects.
    - `formulaHelpers.js`: Manages string formatting and related utilities.
    - `helpersForDropdownFilter.js`: Manages dropdown filter functionality.
    - `index.js`: Aggregates and exports helpers for easier imports.
    - `location_helpers.js`: Formats location data into strings.
    - `navigatorHelper.js`: Assists with page navigation.
    - `operation_hour_helpers.js`: Handles time-based logic.
    - `phone_number_helpers.js`: Formats, validates, and parses phone numbers.
    - `validation_helpers.js`: Provides data validation utilities.
  
  - `defaults.js`: Stores constant strings and configuration values referenced across the application.
  
  - `App.js`: The main application component, serving as the root of the React component tree.
  - `ErrorBoundary.js`: Catches and displays errors occurring in the component tree below, preventing the entire app from crashing.
  - `index.js`: The entry point of the application, responsible for rendering the root `App` component into the DOM.
  - `routes.js`: Defines route mappings for the application, linking URLs to components.





