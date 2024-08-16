import {
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Form,
    Space,
    Spin,
    Table,
    theme,
    Typography,
} from 'antd';
import { RightOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import TenantFilter from "./TenantFilter";
import React, { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthStore } from '../../store';
import { getTenants } from '../../http/api';
import TenantForm from './forms/TenantForm';
import { debounce } from 'lodash';
import { PER_PAGE } from '../../constants';
import { FieldData } from '../../types';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];
const Tenants = () => {
    const [filterForm] = Form.useForm();
    // const queryClient = useQueryClient();
    const { token: { colorBgLayout } } = theme.useToken();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [queryParams, setQueryParams] = React.useState({
        perPage: PER_PAGE,
        currentPage: 1
    })
    const {
        data: tenants,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: async () => {
            const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]));
            const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString();
            return getTenants(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,
    });
    const { user } = useAuthStore();


    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value }))
        }, 500)
    }, [])

    const onFilterChange = (changedFields: FieldData[]) => {
        // console.log(changedFields);
        const changedFilterFields = changedFields.map((item) => {
            return {
                [item.name[0]]: item.value
            }
        }).reduce((acc, item) => ({ ...acc, ...item }), {});
        if ('q' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q)
        } else {
            setQueryParams((prev) => ({
                ...prev, ...changedFilterFields
            }))
        }
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }


    return (
        <>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Flex justify="space-between">
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Tenants' }]}
                    />
                    {isFetching && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    )}
                    {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
                </Flex>

                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <TenantFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}>
                            Add Restaurant
                        </Button>
                    </TenantFilter>
                </Form>


                <Table
                    columns={columns}
                    dataSource={tenants?.data}
                    rowKey={'id'}
                    pagination={{
                        total: tenants?.total,
                        pageSize: queryParams.perPage,
                        current: queryParams.currentPage,
                        onChange: (page) => {
                            // console.log(page);
                            setQueryParams((prev) => {
                                return {
                                    ...prev, currentPage: page
                                }
                            })
                        }
                    }}
                />

                <Drawer
                    title="Create restaurant"
                    styles={{ body: { backgroundColor: colorBgLayout } }}
                    width={720}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => {
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    // form.resetFields();
                                    setDrawerOpen(false);
                                }}>
                                Cancel
                            </Button>
                            <Button type="primary" >
                                Submit
                            </Button>
                        </Space>
                    }>
                    <Form layout="vertical" >
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Tenants