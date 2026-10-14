import { INavData } from "@coreui/angular";
import { UserGuard } from "./_guard/user.guard";
import * as data from '../containers//index';
export const navItems: INavData[] = [

  {
    title: true,
    name: "Menu",
  },
  {
    icon: "fa fa-bar-chart-o",
    name: "    Dashboard",
    url: "/dashboard",

  },
  {
    name: " Access Management",
    url: "/base",
    icon: "fa fa-key",
    children: [
      {
        name: "User",
        url: "/base/user",
        icon: "fa fa-edit",
      },
      {
        name: "Roles",
        url: "/base/role",
        icon: "fa fa-edit",
      },
      {
        name: "Permission",
        url: "/base/permission",
        icon: "fa fa-edit",
      },
    ],
  },
  {
    name: " Master Setup",
    url: "/department",
    icon: "fa fa-graduation-cap",
    children: [
      {
        name: "Department",
        url: "/department/departmentlist",
        icon: "fa fa-edit",
      },
      {
        name: "Branch",
        url: "/department/branch",
        icon: "fa fa-edit",
      },
      {
        name: "Stakeholder",
        url: "/department/stakeholder",
        icon: "fa fa-edit",
      },
      {
        name: "AccountGroup",
        url: "/department/accountgroup",
        icon: "fa fa-edit",
      },
      {
        name: "AccountType",
        url: "/department/accounttype",
        icon: "fa fa-edit",
      },

      {
        name: "Bank Details",
        url: "/department/bankdetails",
        icon: "fa fa-edit",
      },
    ],
  },
  {
    name: "Employee Search",
    url: "/employeeSearch",
    icon: "fa fa-credit-card",
  },
  {
    name: "Registration",
    url: "/registration",
    icon: "fa fa-registered",
    children: [
      {
        name: "Organization Details",
        url: "/registration/organizationRegistration",
        icon: "fa fa-edit",
      },
      {
        name: "Employee Details",
        url: "/registration/employee-details",
        icon: "fa fa-edit",
      },

      // {
      //   name: "PF Organization",
      //   url: "/registration/pfregistrationlist",
      //   icon: "fa fa-edit",
      // },
      // {
      //   name: "PF Employee",
      //   url: "/registration/pfemployeeregistrationlist",
      //   icon: "fa fa-edit",
      // },
      // {
      //   name: "GF Organization",
      //   url: "/registration/company-list",
      //   icon: "fa fa-edit",
      // },
      // {
      //   name: "GF Employee",
      //   url: "/registration/employee-list",
      //   icon: "fa fa-edit",
      // },
    ],
  },
  // employee
  {
    name: "  Employee Transfer",
    url: "/employee/employee-transfer",
    icon: "fa fa-exchange",
  },
  {
    name: "  Accounts",
    url: "/accounts",
    icon: "fa fa-balance-scale",
    children: [
      {
        name: "Collection",
        url: "/accounts/collectionlist",
        icon: "fa fa-edit",
      },
      {
        name: "Payment",
        url: "/accounts/payment",
        icon: "fa fa-edit",
      },
      {
        name: "Account Posting",
        url: "/accounts/account-posting",
        icon: "fa fa-edit",
      }
    ],
  },
  {
    name: "  Deposit",
    url: "/transaction/pfdepositlist",
    icon: "fa fa-credit-card",
  },
  {
    name: "  Refund",
    url: "/transaction",
    icon: "fa fa-balance-scale",
    children: [
      {
        name: "PF/GF Refund",
        url: "/transaction/refunddashboard",
        icon: "fa fa-edit",
      },
      {
        name: "Excess Payment Refund",
        url: "/transaction/excess-payment-refund",
        icon: "fa fa-edit",
      },
        {
        name: "Refund Approval",
        url: "/transaction/refund-approval",
        icon: "fa fa-edit",
      },
      // {
      //   name: "Approval",
      //   url: "/transaction/refund-approval",
      //   icon: "fa fa-edit",
      // },
    ],
  },

  {
    name: "  Reports",
    url: "/report/generate-report",
    icon: "	fa fa-file-pdf-o",
  },
  {
    name: "  Resource",
    url: "/download-form",
    icon: "	fa fa-file-archive-o",
  },
  {
    title: true,
    name: "USER PROFILE",
  },
  {
    name: localStorage.getItem("userName"),
    icon: " fa fa-male",
  },
  {
    name: "  +975-" + localStorage.getItem("mobile_number"),
    icon: " fa fa-phone-square",
  },
  {
    name: localStorage.getItem("employee_id"),
    icon: " fa fa-id-badge",
  },
  {
    name: localStorage.getItem("designation"),
    icon: " fa fa-user-secret",
  },
];
