-- 创建数据库
CREATE SCHEMA `stock_demo` DEFAULT CHARACTER SET utf8mb4 ;

-- ---------------------------------------
-- 用户表 简化角色
-- ---------------------------------------
CREATE TABLE `st_user` (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  mobile varchar(20) NOT NULL DEFAULT '' COMMENT '手机号',
  name varchar(20) NOT NULL DEFAULT '' COMMENT '昵称',
  role tinyint(1) NOT NULL DEFAULT '0' COMMENT '角色：100 超级管理员，0 普通用户',
  password varchar(100) NOT NULL DEFAULT '' COMMENT '密码',
  salt varchar(100) NOT NULL DEFAULT '' COMMENT '密码盐',
  create_dt datetime NOT NULL DEFAULT now() COMMENT '创建时间',
  update_dt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  is_delete tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_mobile` (`mobile`) 
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ---------------------------------------
-- 股票表
-- ---------------------------------------
CREATE TABLE `stock` (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  code varchar(10) NOT NULL DEFAULT '' COMMENT '股票代码',
  name varchar(30) NOT NULL DEFAULT '' COMMENT '股票名称',
  market varchar(10) NOT NULL DEFAULT '' COMMENT '股票市场',
  price decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '当前股价',  
  pe decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '当前PE（市盈率）',
  pe_avg decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '平均PE（市盈率）',
  pe_ttm decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '当前PE TTM（市盈率）',
  pe_ttm_avg decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '平均PE TTM（市盈率）',
  pe_ttm_rate decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '最新pet_tm与平均值的比例',
  pe_ttm_mid decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT 'pe_ttm中位数',
  total_mv decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '总市值',
  source_data json NULL COMMENT '数据源',
  create_dt datetime NOT NULL DEFAULT now() COMMENT '创建时间',
  update_dt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  is_delete tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_stock_code` (`code`) 
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ---------------------------------------
-- 股票流水账: 记录每日pe pb等值，简化为只记录pe
-- ---------------------------------------
CREATE TABLE `stock_log` (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  code varchar(10) NOT NULL DEFAULT '' COMMENT '股票代码',
  log_date date NOT NULL COMMENT '日期',
  pe decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '当前PE（市盈率）',
  pe_ttm decimal(12,4) NOT NULL DEFAULT '0.00' COMMENT '当前PE TTM（市盈率）',
  total_mv decimal(16,4) NOT NULL DEFAULT '0.00' COMMENT '总市值',
  create_dt datetime NOT NULL DEFAULT now() COMMENT '创建时间',
  update_dt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  is_delete tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code_log_date` (`code` ASC,`log_date` ASC),
  INDEX `idx_code` (`code` ASC)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ---------------------------------------
-- 用户股票自选列表
-- ---------------------------------------
CREATE TABLE `user_stock` (
  id int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  uid int(11) NOT NULL DEFAULT '0' COMMENT '用户id',
  code varchar(10) NOT NULL DEFAULT '' COMMENT '股票代码',
  create_dt datetime NOT NULL DEFAULT now() COMMENT '创建时间',
  update_dt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  is_delete tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_uid_code` (`uid` ASC,`code` ASC),
  FOREIGN KEY (uid) REFERENCES st_user(id),
  FOREIGN KEY (code) REFERENCES stock(code)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;