# Python 3.10イメージをベースとする
FROM python:3.10

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# 依存関係をインストールするためのファイルをコピー
COPY requirements.txt ./

# 依存関係のインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのソースコードをコピー
COPY sns/ ./sns/

# ポートを公開
EXPOSE 8000

# Djangoアプリケーションの起動コマンド
CMD ["python", "sns/manage.py", "runserver", "0.0.0.0:8000"]
