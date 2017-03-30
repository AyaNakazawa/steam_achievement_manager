
# Steam Achievement Manager

## Description

Steam Achievement Manager は、PCゲームのプラットフォームである Steam の実績を閲覧できるものです。

## Usage

1. ゲーム名 と ユーザー名 を入力すると、実績情報を自動で取得し、表示します。
  * ゲーム名
    * gameFriendlyName
  * ユーザー名
    * customURL
2. 検索バーに文字列を入力すると、実績が絞り込まれます。
  * 検索用シンボル
    * 文字列 - 文字列が 実績名 解除日時 実績内容 メモ に含まれるか
    * $c - クリアしているか
    * $c1 - チェックボックス1
    * $c5 - チェックボックス5
    * ! - シンボルの先頭に ! をつけると否定
  * 区切り文字
    * スペース - スペースを区切り文字として、論理演算を行う
  * 論理演算子
    * OR - シンボルが一つでも真ならTrue
    * AND - 全てのシンボルが真ならTrue
    * NOR - シンボルが一つでも偽ならTrue
    * NAND - 全てのシンボルが偽ならTrue
3. ゲーム名 と ユーザー名 の組み合わせと、それぞれの実績の メモ と チェック状況 はブラウザに保存され、次回以降それぞれ自動で表示されます。
  * localStorageを使用

## Licence

MIT License

## Author

[Aya Nakazawa](https://github.com/AyaNakazawa)
