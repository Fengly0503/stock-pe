import React, { useState, useEffect } from 'react';
import { Input, Table, Row, Col, Button, Modal, message } from 'antd';
import * as dayjs from 'dayjs';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { userStockList, StockListQuery, deleteChoice } from '@/services/stock';

const { confirm } = Modal;

const serachStyle = {
  marginLeft: '0',
  marginRight: '0',
  background: '#fff',
  padding: '15px 0',
};

const { Search } = Input;
const StockList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [keyWords, setKeyWords] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [defOrderBy, setDefOrderBy] = useState<number>(0);

  const fetchData = (page: any, orderBy: number) => {
    setLoading(true);
    const query: StockListQuery = {
      keywords: keyWords,
      pageIndex: page.current,
      pageSize: page.pageSize,
      orderBy,
    };
    userStockList(query).then((res: any) => {
      setLoading(false);
      setData(res.data.list);
      setPagination({
        current: res.data.pageIndex,
        pageSize: res.data.pageSize,
        total: res.data.totalNum,
      });
    });
  };

  const deleteChoiceFunc = (code: string) => {
    confirm({
      title: '温馨提示！',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除该自选吗？',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        deleteChoice(code).then((res: any) => {
          if (res.code === 0 && res.data) {
            message.success('删除成功');
            fetchData(pagination, defOrderBy);
          } else {
            message.error('删除失败，请重试');
          }
        });
      },
    });
  };

  const columns = [
    {
      title: '代码',
      dataIndex: 'code',
      width: '10%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '当前PE',
      dataIndex: 'peTtm',
      width: '13%',
    },
    {
      title: 'PE均值',
      dataIndex: 'peTtmAvg',
      width: '13%',
    },
    {
      title: 'PE当前占比',
      dataIndex: 'peTtmRate',
      width: '13%',
      sorter: true,
      render: (text: string) => {
        if (Number(text) === 0) {
          return <span style={{ color: '#999' }}>{text}</span>;
        } else if (Number(text) > 0 && Number(text) < 0.8) {
          return <span style={{ color: '#fb0404' }}>{text}</span>;
        } else if (Number(text) > 0.8 && Number(text) < 1) {
          return <span style={{ color: '#fb5a5a' }}>{text}</span>;
        } else if (Number(text) >= 1 && Number(text) < 3) {
          return <span style={{ color: '#185aa0' }}>{text}</span>;
        } else {
          return <span style={{ color: '#12ad1f' }}>{text}</span>;
        }
      },
    },
    {
      title: 'PE中位数',
      dataIndex: 'peTtmMid',
      width: '13%',
    },
    {
      title: '更新日期',
      dataIndex: 'updateDt',
      width: '15%',
      render: (text: string) => {
        return dayjs(text).format('YYYY-MM-DD');
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '13%',
      render: (text: string, record: any) => {
        if (record.us) {
          return <span style={{ color: '#f04104' }}>已添加</span>;
        } else {
          return (
            <Button
              type="link"
              onClick={() => {
                deleteChoiceFunc(record.code);
              }}
            >
              删除
            </Button>
          );
        }
      },
    },
  ];

  const handleTableChange = (page: any, filters: any, sorter: any) => {
    let orderBy = 0;
    if (sorter.order === 'ascend') {
      orderBy = 1;
      setDefOrderBy(1);
    } else if (sorter.order === 'descend') {
      orderBy = 2;
      setDefOrderBy(2);
    } else {
      setDefOrderBy(0);
    }
    setPagination(page);
    fetchData(page, orderBy);
  };

  const onSearch = (value: string) => {
    setPagination({ ...pagination, current: 1 });
    setKeyWords(value);
  };
  useEffect(() => {
    fetchData(pagination, defOrderBy);
  }, [keyWords]);
  return (
    <>
      <Row gutter={16} style={serachStyle}>
        <Col>
          <Search placeholder="输入股票代码或者名称" allowClear onSearch={onSearch} enterButton />
        </Col>
      </Row>
      <Table
        columns={columns}
        rowKey={(record) => record.code}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
};

export default StockList;
