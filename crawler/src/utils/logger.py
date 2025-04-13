import logging
import os


def get_logger(name: str = "app", level=logging.INFO, log_dir="logs") -> logging.Logger:
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, f"blocktweet_{name}.log")
        
        formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
        
        # 输出到终端
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)
        
        # 输出到日志文件
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        
        logger.setLevel(level)
    
    return logger
