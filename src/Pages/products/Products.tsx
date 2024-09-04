import { Breadcrumb, Flex, Space } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined, LoadingOutlined } from '@ant-design/icons'

const Products = () => {
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={'large'}>
                <Flex justify="space-between">
                    <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Products' }]} />
                    {/* {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />}
                    {isError && <Typography.Text type="danger">{error?.message}</Typography.Text>} */}
                </Flex>
            </Space>
        </>
    )
}

export default Products