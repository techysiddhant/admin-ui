import { Breadcrumb, Button, Flex, Form, Space } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import ProductFilter from "./ProductFilter";

const Products = () => {
    // const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={'large'}>
                <Flex justify="space-between">
                    <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Products' }]} />
                    {/* {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />}
                    {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>} */}
                </Flex>
                <Form form={filterForm} onFieldsChange={() => { }}>
                    <ProductFilter>
                        <Button onClick={() => { }} type="primary" icon={<PlusOutlined />} >
                            Add user
                        </Button>
                    </ProductFilter>
                </Form>
            </Space>
        </>
    )
}

export default Products