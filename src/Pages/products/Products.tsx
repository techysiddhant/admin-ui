import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, Typography } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import ProductFilter from "./ProductFilter";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { PER_PAGE } from "../../constants";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./helpers";
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
    const [form] = Form.useForm();
    const { user } = useAuthStore();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentEditingProduct, setcurrentEditingProduct] = useState<Product | null>(null);
    const [filterForm] = Form.useForm();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (currentEditingProduct) {
            setDrawerOpen(true);
            const priceConfiguration = Object.entries(currentEditingProduct.priceConfiguration).reduce((acc, [key, value]) => {
                const stringifedKey = JSON.stringify({ configurationKey: key, priceType: value.priceType });
                return {
                    ...acc,
                    [stringifedKey]: value.availableOptions
                }
            }, {});
            const attributes = currentEditingProduct.attributes.reduce((acc, item) => {
                return {
                    ...acc,
                    [item.name]: item.value
                }
            }, []);
            // console.log(currentEditingProduct);
            // console.log(priceConfiguration);
            form.setFieldsValue({ ...currentEditingProduct, priceConfiguration: priceConfiguration, attributes: attributes, categoryId: currentEditingProduct.category._id });
        }
    }, [currentEditingProduct, form])

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
    const { mutate: productMutate, isPending: isCreateLoading } = useMutation({
        mutationKey: ['user'],
        mutationFn: async (data: FormData) => {
            if (currentEditingProduct) {
                return updateProduct(currentEditingProduct._id, data).then((res) => res.data)
            } else {
                return createProduct(data).then((res) => res.data)
            }
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            form.resetFields();
            setDrawerOpen(false);
            setcurrentEditingProduct(null);
            return;
        },
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
    const onHandleSubmit = async () => {
        await form.validateFields();
        const priceConfiguration = form.getFieldValue('priceConfiguration');
        const pricing = Object.entries(priceConfiguration).reduce((acc, [key, value]) => {
            const parsedKey = JSON.parse(key);
            return {
                ...acc,
                [parsedKey.configurationKey]: {
                    priceType: parsedKey.priceType,
                    availableOptions: value
                }
            }
        }, {});
        const categoryId = form.getFieldValue('categoryId');
        const attributes = Object.entries(form.getFieldValue('attributes')).map(([key, value]) => {
            return {
                name: key,
                value: value
            }
        })
        const postData = {
            ...form.getFieldsValue(),
            image: form.getFieldValue('image'),
            isPublish: form.getFieldValue('isPublish') ? true : false,
            categoryId,
            priceConfiguration: pricing,
            attributes,
            tenantId: user?.role === 'manager' ? user?.tenant?.id : form.getFieldValue('tenantId')
        }
        const formData = makeFormData(postData);
        productMutate(formData);
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
                        <Button onClick={() => setDrawerOpen(true)} type="primary" icon={<PlusOutlined />} >
                            Add Product
                        </Button>
                    </ProductFilter>
                </Form>
                <Table columns={[...columns, {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    render: (_: string, record: Product) => {
                        return (
                            <Space>
                                <Button onClick={() => setcurrentEditingProduct(record)} type="link">Edit</Button>
                            </Space>
                        )
                    }
                }]} dataSource={products?.data} rowKey={'_id'} pagination={{
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

                <Drawer title={currentEditingProduct ? "Edit Product" : "Create Product"} width={720} open={drawerOpen} destroyOnClose={true} onClose={() => { form.resetFields(); setDrawerOpen(false); setcurrentEditingProduct(null); }}
                    extra={
                        <Space>
                            <Button onClick={() => { form.resetFields(); setDrawerOpen(false); setcurrentEditingProduct(null) }}>Cancel</Button>
                            <Button type="primary" onClick={onHandleSubmit} loading={isCreateLoading}>{currentEditingProduct ? "Update Product" : "Submit"}</Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" form={form}>
                        <ProductForm form={form} />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Products