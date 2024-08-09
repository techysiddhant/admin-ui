import {
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Space,
    Spin,
    Table,
    Typography,
} from 'antd';
import { RightOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import TenantFilter from "./TenantFilter";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from '../../store';
import { getTenants } from '../../http/api';

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
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const {
        data: tenants,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => {



            return getTenants().then((res) => res.data);
        },
        // placeholderData: keepPreviousData,
    });
    const { user } = useAuthStore();



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

                {/* <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <TenantFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}>
                            Add Restaurant
                        </Button>
                    </TenantFilter>
                </Form> */}
                <TenantFilter>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}>
                        Add Restaurant
                    </Button>
                </TenantFilter>

                <Table
                    columns={columns}
                    dataSource={tenants?.data}
                    rowKey={'id'}

                />

                <Drawer
                    title="Create restaurant"
                    // styles={{ body: { backgroundColor: colorBgLayout } }}
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
                    {/* <Form layout="vertical" form={form}>
                        <TenantForm />
                    </Form> */}
                </Drawer>
            </Space>
        </>
    )
}

export default Tenants