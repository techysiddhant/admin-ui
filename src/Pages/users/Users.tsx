import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, Typography } from "antd"
import { RightOutlined, LoadingOutlined } from '@ant-design/icons'
import { Link, Navigate } from "react-router-dom"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUser, getUsers } from "../../http/api"
import { CreateUserData, User } from "../../types"
import { useAuthStore } from "../../store"
import UserFilter from "./UserFilter"
import React, { useState } from "react"
import { PlusOutlined } from '@ant-design/icons'
import UserForm from "./forms/UserForm"
import { PER_PAGE } from "../../constants"

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {
            return (
                <div>{record.firstName} {record.lastName}</div>
            )
        }
    },

    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
]
const Users = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [queryParams, setQueryParams] = React.useState({
        perPage: PER_PAGE,
        currentPage: 1
    })
    const { data: users, isFetching, isError, error } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const queryString = new URLSearchParams(queryParams as unknown as Record<string, string>).toString();
            return getUsers(queryString).then((res) => res.data)
        },
        placeholderData: keepPreviousData
    })
    const { mutate: userMutate } = useMutation({
        mutationKey: ['user'],
        mutationFn: async (data: CreateUserData) => createUser(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            return;
        },
    })
    const { user } = useAuthStore();
    if (user?.role !== 'admin') {
        return <Navigate to='/auth/login' replace={true} />
    }
    const onHandleSubmit = async () => {
        // console.log(form.getFieldsValue());
        await form.validateFields();
        await userMutate(form.getFieldsValue());
        form.resetFields();
        setDrawerOpen(false);
    }
    // console.log(users);
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={'large'}>
                <Flex justify="space-between">
                    <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Users' }]} />
                    {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />}
                    {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>}
                </Flex>
                <UserFilter onFilterChange={(filterName: string, filterValue: string) => {
                    console.log(filterName, filterValue);
                }} >
                    <Button onClick={() => setDrawerOpen(true)} type="primary" icon={<PlusOutlined />} >
                        Add user
                    </Button>
                </UserFilter>
                <Table columns={columns} dataSource={users?.data} rowKey={'id'} pagination={{
                    total: users?.total,
                    pageSize: queryParams.perPage,
                    current: queryParams.currentPage,
                    onChange: (page) => {
                        setQueryParams((prev) => {
                            return {
                                ...prev, currentPage: page
                            }
                        })
                    }
                }} />
                <Drawer title="Create user" width={720} open={drawerOpen} destroyOnClose={true} onClose={() => { form.resetFields(); setDrawerOpen(false) }}
                    extra={
                        <Space>
                            <Button onClick={() => { form.resetFields(); setDrawerOpen(false) }}>Cancel</Button>
                            <Button type="primary" onClick={onHandleSubmit}>Submit</Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" form={form}>
                        <UserForm />
                    </Form>
                </Drawer>
            </Space>

        </>
    )
}

export default Users