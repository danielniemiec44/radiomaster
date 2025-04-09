import React, {ReactNode} from 'react';
import PropTypes from 'prop-types';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Skeleton} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import CustomFetchForUseQuery from "./CustomFetchForUseQuery.jsx";


interface FetchedSelectProps {
    value: string;
    queryName: string;
    endpoint: string;
    method?: string;
    body?: object;
    onChange?: (event: SelectChangeEvent<string>, child: ReactNode) => void;
    label?: string;
}

export default function FetchedSelect({ value, queryName, endpoint, method = "GET", body = null, onChange, label = "" }: FetchedSelectProps) {
    const { data, isLoading, isError } = useQuery<any>(queryName, CustomFetchForUseQuery(endpoint, method, body)); // Use the returned function.
    const { t } = useTranslation();

    if (isError) {
        return <div>{t("errors.fetchingDataError", { queryName })}</div>;
    }

    if (isLoading) {
        return <Skeleton />;
    }

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel id="product_type_label">{label}</InputLabel>
            <Select
                labelId="product_type_label"
                id="product_type_select"
                value={value}
                label={label}
                onChange={onChange}
            >
                <MenuItem value="">
                    <em>Brak wyboru</em>
                </MenuItem>
                {data && data.map((row, index) => (
                    <MenuItem value={row?.id}>{row?.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

FetchedSelect.propTypes = {
    defaultValue: PropTypes.any,
    queryName: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
    method: PropTypes.string,
    body: PropTypes.object,
};
