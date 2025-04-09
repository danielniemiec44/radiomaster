import React, {useEffect} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerTypes} from "../Reducers";
import { useWarehouse } from "../Pages/WarehouseIndex";
import {Accordion, AccordionDetails, AccordionSummary, Box} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SquareTextField from "../Utils/SquareTextField";
import Stack from "@mui/material/Stack";
import {Link} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {t} from "i18next";
import Button from "@mui/material/Button";
import SquareButton from "../Utils/SquareButton";
import Grid from "@mui/material/Grid";
import CustomersPage from "../Pages/CustomersPage";
import {useMutation} from "react-query";
import eventEmitter from "../Utils/eventEmitter";
import CustomFetchForUseQuery from "../Utils/CustomFetchForUseQuery";
import TextField from "@mui/material/TextField";
import ProductItem from "../Components/ProductItem";
import ProductList from "../Components/ProductList";

function ExampleModal(){
    const saleItems = useSelector((state: RootReducerTypes) => state.warehouse.saleItems);
    const { data: warehouse, status } = useWarehouse(undefined, undefined, undefined, []);
    const dispatch = useDispatch();
    const customer = useSelector((state: RootReducerTypes) => state.warehouse.selectedCustomer);
    const user = useSelector((state: RootReducerTypes) => state.user.user);


    const validateSale = React.useMemo(() => {
        return saleItems?.length === 0 || !customer || saleItems.some((item) => item.quantity < 1);
    }, [saleItems, customer]);

    useEffect(() => {
        console.log("Sale items: ", saleItems);
    }, [saleItems]);



    function clampQuantity(value, minVal, maxVal) {
        return Math.min(Math.max(value, minVal), maxVal);
    }

// 2. A single function to get the updated sale items with clamped quantity
    function getUpdatedSaleItems(item, newQuantity, saleItems, warehouse) {
        return saleItems.map((currentItem) => {
            if (currentItem.id !== item.id) return currentItem;

            // Look up maxQuantity for this item in radiomaster or default to Infinity
            const warehouseItem = warehouse?.warehouses?.find((w) => w?.id === item?.id);
            const maxQuantity = warehouseItem?.quantity ?? Infinity;

            // If you want a minimum of 0, adjust here (or change to 1, etc.)
            const clampedQuantity = clampQuantity(Number(newQuantity), 0, maxQuantity);

            return { ...currentItem, quantity: clampedQuantity };
        });
    }

// 3. updateQuantity: uses the same helper but sets quantity directly
    function updateQuantity(item, inputValue) {
        const updatedPayload = getUpdatedSaleItems(item, inputValue, saleItems, warehouse);

        dispatch({
            type: "OPEN_COMPLETING_SALE_MODAL",
            payload: updatedPayload
        });
    }

// 4. changeQuantityByButton: calculates new quantity and then reuses the same helper
    function changeQuantityByButton(item, value) {
        const newQuantity = Number(item.quantity) + value;
        const updatedPayload = getUpdatedSaleItems(item, newQuantity, saleItems, warehouse);

        dispatch({
            type: "OPEN_COMPLETING_SALE_MODAL",
            payload: updatedPayload
        });
    }

    const completeSale = () => {
        mutation.mutate();
    };


        const mutation = useMutation(() => {
            const saleItemsPayload = saleItems.map((item) => {
                return {
                    id: item.id,
                    quantity: item.quantity
                }
            });

            const payload = {
                saleItems: saleItemsPayload,
                buyerId: customer.id,
                sellerId: user.id ?? -1
            }

            return CustomFetchForUseQuery(`sell`, 'POST', payload)();
        }, {
            onSuccess: (data) => {
                console.log("Data successfully sent to backend", data);
                dispatch({ type: "CLOSE_COMPLETING_SALE_MODAL_WITH_RESET_QUANTITIES_AND_RESET_CUSTOMER" });
                eventEmitter.emit('showSnackbar', { message: t("infoMessages.success"), transition: 'slide', variant: 'success' });
            },
            onError: (error: any) => {
                console.error("Error while sending data to backend", error);
                const errorMessage = error?.error;
                eventEmitter.emit('showSnackbar', { message: errorMessage, transition: 'slide', variant: 'error' });
            }
        });

    return (
        <Dialog open={true} maxWidth={"lg"} fullWidth>
            <DialogTitle>
                <Typography variant={'h6'}>Kompletowanie zamówienia - sprzedaż z magazynu</Typography>
            </DialogTitle>
            <DialogContent style={{ height: "calc(100vh - 200px)", boxSizing: "border-box" }}>
                <Grid container spacing={2} style={{ height: "100%" }}>
                    <Grid item xs={12} md={6} style={{ height: "calc(100% - 40px)", overflowY: "auto", marginTop: 20, marginBottom: 20, boxSizing: "border-box" }}>
            <ProductList
                saleItems={saleItems}
                updateQuantity={updateQuantity}
                changeQuantityByButton={changeQuantityByButton}
            />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CustomersPage />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { dispatch({ type: "CLOSE_COMPLETING_SALE_MODAL" }) }}>{t("dialogActions.cancel")}</Button>
                <Button disabled={validateSale} onClick={completeSale} color={"primary"}>{t("dialogActions.complete_sale")}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExampleModal;