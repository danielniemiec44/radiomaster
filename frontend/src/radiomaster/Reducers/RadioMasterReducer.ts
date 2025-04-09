const initialState = {
    showAddDeliveryModal: false,
    editEntryId: -1,
    showCategoryList: false,
    editCategoryId: -1,
    displayCategoryRows: -1,
    productDetailsId: -1,
    saleItems: null,
    showSaleCompletingModal: false,
    filter: [],
    selectedCustomer: null
};


const radioMasterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_ADD_DELIVERY_MODAL':
            return {
                ...state,
                showAddDeliveryModal: true
            };
        default:
            return state;
    }
};

export { radioMasterReducer };