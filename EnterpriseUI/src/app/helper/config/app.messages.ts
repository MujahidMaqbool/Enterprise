export const Messages = {
    General: {
     YesDelete: "Yes, Delete",
     Delete: "Delete",
    },

    Error: {
        Save_Error: "There was an error while saving {0}. Please try again later",
        Send_Error: "There was an error while sending {0}. Please try again later",
        Get_Error: "There was an error while getting {0}(s). Please try again later",
        LogOut_Error: "There was an error while Logout. Please try again later",
        Login_Error: "There was an error while trying to login. Please try again later",
        Reset_Password: "There was an error while processing your request. Please try again later",
        Check_Permission: "There was an error checking permission. Please try again later",
        Password_Change: "There was an error changing your password. Please try again later",
        Password_Token_Save: "There was an error validating your email. Please try again later",
        Dropdowns_Load_Error: "There was an error while loading the dropdowns. Please try again later",
        No_Record_Error: "No record found.",
        Delete_Error: "There was an error while deleting {0}. Please try again later",
        Cancel_Error: "There was an error while cancelling {0}. Please try again later",
        Permission_Module_UnAuthorized: "You are not authorized to access this module",
        Permission_Page_UnAuthorized: "You are not authorized to access this page",
        Please_Set_The_Minimum_PercentageBetween: "Please set the minimum percentage (between 0% to 100%)",
        Reward_Program_Default_Error : "The reward program cannot be deleted as it is currently set as default within a branch.",
        Atleast_One_branch : "At least one branch should be selected.",
        Please_Add_Price_To_Save_The_Product_Successfully: "Please add price to save the product successfully."
    },

    Success: {
        Password_Save: "Password saved successfully. Please login to continue.",
        Reset_Password_Email_Sent: "An email has been sent to your account. Please follow the instructions in the email",
        Save_Success: "{0} saved successfully.",
        Delete_Success: "{0} deleted successfully.",
        Cancel_Success: "{0} cancelled successfully",
        Reset_Fav_View :"Favorite View reset to default successfully",
        Email_Success: "Message sent to supplier.",
        Mark_Received:"Purchase order received successfully"
    },

    Validation: {
        /* Validation Messages */
        Password_Invalid: "Password is invalid",
        Password_Mismatch: "Password does not match.",
        Password_MinLength: "Password must be atleast 8 characters long",
        Password_Required: "You must provide a password",
        Password_ConfirmPass_Required: "You must confirm password to continue",
        Password_Token_Invalid: "Invalid token. Please try again using the Forgot Password link",
        Password_Token_Expired: "Token has expired. Please try again using the Forgot Password link",
        OldPassword_Incorrect: "Current password is incorrect",
        OldPassword_Required: "Please provide the current password",
        Email_Invalid: "Email is invalid",
        Email_Not_Exist: "Email does not exists",
        Phone_Invalid: "Phone/Mobile number is invalid",
        Fax_Invalid: "Fax number is invalid",
        Email_MaxLength: "Email body should not be greater than {0} characters",
        Select_Module: "At least one module should be selected",
        Info_Required: "Please fill in the required information.",
        Select_BranchView_Role: "Please select branch view role.",
        No_of_Expiray_Days:'Number of Expiry Days must be greater than 0.',
        Email_Required: 'You must provide an email',
        Please_Fill_Data:'Please fill the valid Information',
        Invalid_Tax: "Tax value cannot be 0 or greater than 100.",
        Attribute_selected_multiple: "There are one or more duplicate attributes added in the variants, please remove duplicate attributes and click on generate again.",
        select_Attribute_AttributeValue: "Please add at least one value against each of the added attributes to generate variants.",
        Please_Add_Atleast_1_Branch_To_Proceed: "Please add atleast 1 branch to proceed.",
        Adust_stock_cannot_be_less_then_zero: "Adjust stock cannot accept a value of zero or less than zero.",
        please_select_reason: "Please select reason.",
        Please_Select_AtLeastOne: "Please select at least one {0}.",
        Please_Add_Price_To_Save_The_Product_Successfully:"Please add price to save the product successfully.",
        PleaseSelect:"Please select {0}",
        Max_Attribute_Value: "A maximum of 125 variants can be created for a product with the combination of attributes and their values. Please delete some values or attributes and try again.",
        Order_Quantity_validation_Msg:"Order quantity should be at least 1.",
        Supplier_Price_validation_Msg:"Supplier price should be greater than or equal to 0.",
        Quantity_validation_Msg:"Received quantity should be greater than 0.",
        Product_Validation_Msg:"Please add at least 1 product.",
        Select_Required_Info: "Please select the required information.",
    },


    Generic_Messages: {
        No_Record_Found: "No Records Found",
        Error_Message: "There was an error while {0}. Please try again later",
    },
    Delete_Messages:{
        Delete: "Delete",
        Del_Msg_Generic:"Are you sure you want to delete {0}",
        Del_Msg_Generic_Are_You_Sure:"Are you sure you want to delete {0}",

        Del_Msg_AreYouSure:"Are you sure you want to delete?",
        Del_Msg_Undone:"This cannot be undone!",
        Del_Msg_Product_Generic:"This would delete the {0} from associated branches and cannot be undone ?",

        Del_Msg_reward_Program:"All reward advanced settings and exceptions will be deleted.This cannot be undone!",
        Confirm_delete:"Confirm Delete",
        markAs_receive:"Mark as Received",
        Confirm:"Confirm",
        Del_Msg_Heading: "Are you sure you want to delete this {0}?",
        Del_Msg_Description:"This would delete the {0} from associated branches and cannot be undone?",
        Del_Variant_Msg_Description:"This would make the product variant unavailable from associated branches but can be restored later by clicking on restore variant.",
        Cancel_Purchase_Order:"Cancel Purchase Order",
        Cancel_Msg_AreYouSure:"Are you sure you want to cancel?",
        Receive_Purchase_Order:"Are you sure you want to mark this purchase order as received?",
        Receive_Msg_Description:"Once marked as received, you will be unable to update the quantity of received products."

    },
    Reset_Messages:{
        reset_Title_Msg :"Alert",
        reset_Msg_Generic:"Are you sure you want to reset back to default view ?",
        reset_Msg_Undone:"Favorite view will be deleted. This cannot be undone!",
    },
    Dialog_Title: {
        /* Confirmation Alert Messages */
        Set_As_Default:"Set as Default",
        AlertRewardTermination:"Revert Termination",

    },
    Confirmation: {
        /* Confirmation Alert Messages */
        Confirmation_Revert_Program_default_heading: "Are you sure you want to set the reward program as default?",
        Confirmation_Revert_Program_default_Message: "Once set, all new and existing customers without any active reward program will be enrolled in this program according to the enrollment settings",
        Confirmation_Revert_Program : "Are you sure you want to revert termination of the reward program ?",
        Confirmation_Branch_Unselect: "This reward program is set as default for {0}. Are you sure you want to proceed?",
        Confirm_Delete_Title:'Confirm Delete',
    },
}
