import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, Typography } from "antd"
import { RightOutlined, LoadingOutlined } from '@ant-design/icons'
import { Link, Navigate } from "react-router-dom"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUser, getUsers } from "../../http/api"
import { CreateUserData, FieldData, User } from "../../types"
import { useAuthStore } from "../../store"
import UserFilter from "./UserFilter"
import React, { useMemo, useState } from "react"
import { PlusOutlined } from '@ant-design/icons'
import UserForm from "./forms/UserForm"
import { PER_PAGE } from "../../constants"
import { debounce } from "lodash"

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
    {
        title: 'Restaurant',
        dataIndex: 'tenant',
        key: 'tenant',
        render: (_text: string, record: User) => {
            return (
                <div>{record.tenant?.name}</div>
            )
        }
    },
]
const Users = () => {
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [queryParams, setQueryParams] = React.useState({
        perPage: PER_PAGE,
        currentPage: 1
    })
    const { data: users, isFetching, isError, error } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]));
            const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString();
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
    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }))
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
                ...prev, ...changedFilterFields, currentPage: 1
            }))
        }
    }
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
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <UserFilter>
                        <Button onClick={() => setDrawerOpen(true)} type="primary" icon={<PlusOutlined />} >
                            Add user
                        </Button>
                    </UserFilter>
                </Form>

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
                    },
                    showTotal: (total: number, range: [number, number]) => {
                        // console.log(range, total)
                        return `Showing ${range[0]}-${range[1]} of ${total} items`
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