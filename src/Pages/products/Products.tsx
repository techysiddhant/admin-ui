import { Breadcrumb, Button, Flex, Form, Image, Space, Spin, Table, Tag, Typography } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import ProductFilter from "./ProductFilter";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { PER_PAGE } from "../../constants";
import { getProducts } from "../../http/api";
import { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
const columns = [

    {
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
        render: (_text: string, record: Product) => {
            return (
                <div>
                    <Space>
                        <Image width={60} src={record.image} />
                        <Typography.Text>{record.name}</Typography.Text>
                    </Space>
                </div>
            )
        }
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (_text: boolean, record: Product) => {
            return (
                <div>
                    {record.category.name}
                </div>
            )
        }
    },
    {
        title: 'Status',
        dataIndex: 'isPublish',
        key: 'isPublish',
        render: (_text: boolean, record: Product) => {
            return (
                <>
                    {
                        record.isPublish ? <Tag color='green'>Published</Tag> : <Tag color='purple'>Draft</Tag>
                    }
                </>
            )
        }
    },
    {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => {
            return (
                <Typography.Text>
                    {format(new Date(text), 'dd/MM/yyyy HH:mm')}
                </Typography.Text>
            )
        }
    },

]
const Products = () => {
    // const [form] = Form.useForm();
    const { user } = useAuthStore();

    const [filterForm] = Form.useForm();
    //TODO: fix this tenantId issue on backend so we don't have security issues
    const [queryParams, setQueryParams] = React.useState({
        limit: PER_PAGE,
        page: 1,
        tenantId: user?.role === 'manager' ? user?.tenant?.id : undefined
    })
    const { data: products, isFetching, isError, error } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: async () => {
            const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]));
            const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString();
            return getProducts(queryString).then((res) => res.data)
        },
        placeholderData: keepPreviousData
    })
    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, page: 1 }))
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
                ...prev, ...changedFilterFields, page: 1
            }))
        }
    }
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={'large'}>
                <Flex justify="space-between">
                    <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Products' }]} />
                    {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />}
                    {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>}
                </Flex>
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <ProductFilter>
                        <Button onClick={() => { }} type="primary" icon={<PlusOutlined />} >
                            Add Product
                        </Button>
                    </ProductFilter>
                </Form>
                <Table columns={[...columns, {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    render: () => {
                        return (
                            <Space>
                                <Button onClick={() => {
                                }} type="link">Edit</Button>
                            </Space>
                        )
                    }
                }]} dataSource={products?.data} rowKey={'id'} pagination={{
                    total: products?.total,
                    pageSize: queryParams.limit,
                    current: queryParams.page,
                    onChange: (page) => {
                        setQueryParams((prev) => {
                            return {
                                ...prev, page: page
                            }
                        })
                    },
                    showTotal: (total: number, range: [number, number]) => {
                        // console.log(range, total)
                        return `Showing ${range[0]}-${range[1]} of ${total} items`
                    }
                }} />
            </Space>
        </>
    )
}

export default Products