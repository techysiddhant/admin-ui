import { Breadcrumb, Button, Drawer, Space, Table } from "antd"
import { RightOutlined } from '@ant-design/icons'
import { Link, Navigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../../http/api"
import { User } from "../../types"
import { useAuthStore } from "../../store"
import UserFilter from "./UserFilter"
import { useState } from "react"
import { PlusOutlined } from '@ant-design/icons'

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
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { data: users, isLoading, isError, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            return getUsers().then((res) => res.data.data)
        }
    })
    const { user } = useAuthStore();
    if (user?.role !== 'admin') {
        return <Navigate to='/auth/login' replace={true} />
    }
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={'large'}>
                <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Users' }]} />
                {isLoading && <div>Loading...</div>}
                {isError && <div>{error?.message}</div>}
                <UserFilter onFilterChange={(filterName: string, filterValue: string) => {
                    console.log(filterName, filterValue);
                }} >
                    <Button onClick={() => setDrawerOpen(true)} type="primary" icon={<PlusOutlined />} >
                        Add user
                    </Button>
                </UserFilter>
                <Table columns={columns} dataSource={users} rowKey={'id'} />
                <Drawer title="Create user" width={720} open={drawerOpen} destroyOnClose={true} onClose={() => setDrawerOpen(!drawerOpen)}
                    extra={
                        <Space>
                            <Button>Cancel</Button>
                            <Button type="primary">Submit</Button>
                        </Space>
                    }
                >

                </Drawer>
            </Space>

        </>
    )
}

export default Users