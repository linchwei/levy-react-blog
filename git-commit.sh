#!/bin/bash

# =============================================================================
# 智能 Git 提交脚本
# 使用方法: 
#   ./git-commit.sh                    # 自动提交所有修改
#   ./git-commit.sh "自定义提交信息"    # 使用自定义提交信息
#   ./git-commit.sh --push             # 提交并推送到远程
#   ./git-commit.sh -m "信息" --push   # 自定义信息并推送
# =============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 提交类型映射
get_commit_type() {
    local file="$1"
    local filename=$(basename "$file")
    local extension="${filename##*.}"
    
    case "$file" in
        # 配置文件
        *.config.*|*.json|*.yaml|*.yml|.env*|tsconfig.*|vite.config.*|tailwind.config.*|eslint.config.*)
            echo "config"
            ;;
        # 文档
        *.md|*.txt|README*|CHANGELOG*|LICENSE*)
            echo "docs"
            ;;
        # 样式
        *.css|*.scss|*.sass|*.less|*.styl)
            echo "style"
            ;;
        # 测试
        *.test.*|*.spec.*|__tests__/*|tests/*|cypress/*|playwright/*)
            echo "test"
            ;;
        # 脚本
        *.sh|scripts/*)
            echo "chore"
            ;;
        # 依赖
        package.json|package-lock.json|yarn.lock|pnpm-lock.yaml)
            echo "chore"
            ;;
        # 源代码
        *)
            case "$extension" in
                ts|tsx)
                    if [[ "$file" == *"hook"* ]] || [[ "$file" == *"use"* ]]; then
                        echo "feat"
                    elif [[ "$file" == *"type"* ]] || [[ "$file" == *"interface"* ]]; then
                        echo "types"
                    else
                        echo "feat"
                    fi
                    ;;
                js|jsx)
                    echo "feat"
                    ;;
                vue)
                    echo "feat"
                    ;;
                html)
                    echo "feat"
                    ;;
                *)
                    echo "chore"
                    ;;
            esac
            ;;
    esac
}

# 获取文件描述
get_file_description() {
    local file="$1"
    local filename=$(basename "$file")
    local dirname=$(dirname "$file")
    
    case "$file" in
        src/components/*)
            local component=$(echo "$dirname" | sed 's|src/components/||' | cut -d'/' -f1)
            if [ -n "$component" ]; then
                echo "更新 $component 组件"
            else
                echo "更新组件"
            fi
            ;;
        src/pages/*)
            local page=$(basename "$dirname")
            echo "更新 $page 页面"
            ;;
        src/hooks/*)
            echo "更新自定义 Hook"
            ;;
        src/stores/*)
            echo "更新状态管理"
            ;;
        src/lib/*)
            echo "更新工具函数"
            ;;
        src/types/*)
            echo "更新类型定义"
            ;;
        src/styles/*)
            echo "更新样式"
            ;;
        public/*)
            echo "更新静态资源"
            ;;
        .trae/documents/*)
            echo "更新产品文档"
            ;;
        README.md)
            echo "更新项目文档"
            ;;
        package.json)
            echo "更新项目依赖"
            ;;
        *.config.*|tsconfig.*|vite.config.*|tailwind.config.*)
            echo "更新配置文件"
            ;;
        *.sh)
            echo "更新脚本文件"
            ;;
        *)
            echo "更新 $filename"
            ;;
    esac
}

# 生成提交信息
generate_commit_message() {
    local custom_msg="$1"
    
    # 如果有自定义信息，直接使用
    if [ -n "$custom_msg" ]; then
        echo "$custom_msg"
        return
    fi
    
    # 获取修改的文件列表
    local staged_files=$(git diff --cached --name-only 2>/dev/null || true)
    local unstaged_files=$(git diff --name-only 2>/dev/null || true)
    local untracked_files=$(git ls-files --others --exclude-standard 2>/dev/null || true)
    
    # 合并所有修改的文件
    local all_files="$staged_files $unstaged_files $untracked_files"
    all_files=$(echo "$all_files" | tr ' ' '\n' | sort -u | grep -v '^$' || true)
    
    if [ -z "$all_files" ]; then
        echo ""
        return
    fi
    
    # 统计各类文件
    local feat_count=0
    local fix_count=0
    local docs_count=0
    local style_count=0
    local refactor_count=0
    local test_count=0
    local chore_count=0
    local config_count=0
    local types_count=0
    
    local main_type=""
    local main_desc=""
    local components=""
    local pages=""
    
    while IFS= read -r file; do
        [ -z "$file" ] && continue
        
        local type=$(get_commit_type "$file")
        local desc=$(get_file_description "$file")
        
        case "$type" in
            feat) ((feat_count++)) ;;
            fix) ((fix_count++)) ;;
            docs) ((docs_count++)) ;;
            style) ((style_count++)) ;;
            refactor) ((refactor_count++)) ;;
            test) ((test_count++)) ;;
            chore) ((chore_count++)) ;;
            config) ((config_count++)) ;;
            types) ((types_count++)) ;;
        esac
        
        # 收集组件和页面信息
        if [[ "$file" == src/components/* ]]; then
            local comp=$(echo "$file" | sed 's|src/components/||' | cut -d'/' -f1)
            if [[ ! "$components" =~ "$comp" ]]; then
                components="$components $comp"
            fi
        elif [[ "$file" == src/pages/* ]]; then
            local page=$(echo "$file" | sed 's|src/pages/||' | cut -d'/' -f1)
            if [[ ! "$pages" =~ "$page" ]]; then
                pages="$pages $page"
            fi
        fi
        
        # 记录主要描述（取第一个有效描述）
        if [ -z "$main_desc" ] && [ -n "$desc" ]; then
            main_desc="$desc"
        fi
    done <<< "$all_files"
    
    # 确定主要提交类型
    local max_count=$feat_count
    main_type="feat"
    
    [ $fix_count -gt $max_count ] && { max_count=$fix_count; main_type="fix"; }
    [ $docs_count -gt $max_count ] && { max_count=$docs_count; main_type="docs"; }
    [ $style_count -gt $max_count ] && { max_count=$style_count; main_type="style"; }
    [ $refactor_count -gt $max_count ] && { max_count=$refactor_count; main_type="refactor"; }
    [ $test_count -gt $max_count ] && { max_count=$test_count; main_type="test"; }
    [ $chore_count -gt $max_count ] && { max_count=$chore_count; main_type="chore"; }
    [ $config_count -gt $max_count ] && { max_count=$config_count; main_type="config"; }
    [ $types_count -gt $max_count ] && { max_count=$types_count; main_type="types"; }
    
    # 生成提交信息
    local commit_msg=""
    
    # 如果有组件修改，优先显示
    if [ -n "$components" ]; then
        components=$(echo "$components" | xargs)
        commit_msg="$main_type: 更新$components组件"
    elif [ -n "$pages" ]; then
        pages=$(echo "$pages" | xargs)
        commit_msg="$main_type: 更新$pages页面"
    elif [ -n "$main_desc" ]; then
        commit_msg="$main_type: $main_desc"
    else
        commit_msg="$main_type: 代码更新"
    fi
    
    # 添加统计信息
    local stats=""
    [ $feat_count -gt 0 ] && stats="${stats}功能($feat_count) "
    [ $fix_count -gt 0 ] && stats="${stats}修复($fix_count) "
    [ $docs_count -gt 0 ] && stats="${stats}文档($docs_count) "
    [ $style_count -gt 0 ] && stats="${stats}样式($style_count) "
    [ $refactor_count -gt 0 ] && stats="${stats}重构($refactor_count) "
    [ $test_count -gt 0 ] && stats="${stats}测试($test_count) "
    [ $chore_count -gt 0 ] && stats="${stats}构建($chore_count) "
    [ $config_count -gt 0 ] && stats="${stats}配置($config_count) "
    [ $types_count -gt 0 ] && stats="${stats}类型($types_count) "
    
    if [ -n "$stats" ]; then
        commit_msg="$commit_msg [$stats]"
    fi
    
    echo "$commit_msg"
}

# 显示 Git 状态
show_git_status() {
    echo -e "${BLUE}📊 Git 状态:${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 检查是否有修改
    local has_changes=false
    
    # 已暂存的文件
    local staged=$(git diff --cached --name-only 2>/dev/null || true)
    if [ -n "$staged" ]; then
        echo -e "${GREEN}✓ 已暂存的文件:${NC}"
        echo "$staged" | while read -r file; do
            [ -n "$file" ] && echo "   • $file"
        done
        has_changes=true
        echo ""
    fi
    
    # 未暂存的修改
    local unstaged=$(git diff --name-only 2>/dev/null || true)
    if [ -n "$unstaged" ]; then
        echo -e "${YELLOW}✗ 未暂存的修改:${NC}"
        echo "$unstaged" | while read -r file; do
            [ -n "$file" ] && echo "   • $file"
        done
        has_changes=true
        echo ""
    fi
    
    # 未跟踪的文件
    local untracked=$(git ls-files --others --exclude-standard 2>/dev/null || true)
    if [ -n "$untracked" ]; then
        echo -e "${CYAN}? 未跟踪的文件:${NC}"
        echo "$untracked" | while read -r file; do
            [ -n "$file" ] && echo "   • $file"
        done
        has_changes=true
        echo ""
    fi
    
    if [ "$has_changes" = false ]; then
        echo -e "${GREEN}✓ 工作区干净，没有需要提交的修改${NC}"
        return 1
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    return 0
}

# 主函数
main() {
    local custom_msg=""
    local should_push=false
    local auto_confirm=false
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -m|--message)
                custom_msg="$2"
                shift 2
                ;;
            --push|-p)
                should_push=true
                shift
                ;;
            -y|--yes)
                auto_confirm=true
                shift
                ;;
            -h|--help)
                echo -e "${CYAN}智能 Git 提交脚本${NC}"
                echo ""
                echo "使用方法:"
                echo "  ./git-commit.sh                    自动提交所有修改"
                echo "  ./git-commit.sh \"提交信息\"         使用自定义提交信息"
                echo "  ./git-commit.sh -m \"信息\"          使用自定义提交信息"
                echo "  ./git-commit.sh --push             提交并推送到远程"
                echo "  ./git-commit.sh -p                 提交并推送到远程"
                echo "  ./git-commit.sh -y                 自动确认，不提示"
                echo "  ./git-commit.sh -h                 显示帮助"
                echo ""
                echo "示例:"
                echo "  ./git-commit.sh                              # 自动提交"
                echo "  ./git-commit.sh \"修复登录bug\"               # 自定义信息"
                echo "  ./git-commit.sh --push                       # 提交并推送"
                echo "  ./git-commit.sh \"更新\" --push               # 自定义并推送"
                exit 0
                ;;
            *)
                # 如果没有使用 -m 选项，第一个参数作为提交信息
                if [ -z "$custom_msg" ] && [[ ! "$1" == -* ]]; then
                    custom_msg="$1"
                fi
                shift
                ;;
        esac
    done
    
    # 检查是否在 git 仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ 错误: 当前目录不是 Git 仓库${NC}"
        exit 1
    fi
    
    echo -e "${CYAN}🚀 智能 Git 提交助手${NC}"
    echo ""
    
    # 显示 Git 状态
    if ! show_git_status; then
        exit 0
    fi
    
    # 生成提交信息
    local commit_msg=$(generate_commit_message "$custom_msg")
    
    if [ -z "$commit_msg" ]; then
        echo -e "${RED}❌ 无法生成提交信息${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📝 生成的提交信息:${NC}"
    echo -e "${GREEN}   $commit_msg${NC}"
    echo ""
    
    # 确认提交
    if [ "$auto_confirm" = false ]; then
        read -p "确认提交? [Y/n]: " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]] && [ -n "$confirm" ]; then
            echo -e "${YELLOW}⚠️  已取消提交${NC}"
            exit 0
        fi
    fi
    
    # 添加所有修改
    echo -e "${BLUE}📦 添加文件到暂存区...${NC}"
    git add -A
    
    # 提交
    echo -e "${BLUE}💾 提交更改...${NC}"
    if git commit -m "$commit_msg"; then
        echo -e "${GREEN}✅ 提交成功!${NC}"
        echo ""
        echo -e "${CYAN}提交详情:${NC}"
        git log -1 --stat --oneline
    else
        echo -e "${RED}❌ 提交失败${NC}"
        exit 1
    fi
    
    # 推送到远程
    if [ "$should_push" = true ]; then
        echo ""
        echo -e "${BLUE}📤 推送到远程仓库...${NC}"
        local branch=$(git branch --show-current)
        if git push origin "$branch"; then
            echo -e "${GREEN}✅ 推送成功!${NC}"
        else
            echo -e "${RED}❌ 推送失败${NC}"
            exit 1
        fi
    fi
    
    echo ""
    echo -e "${GREEN}🎉 完成!${NC}"
}

# 执行主函数
main "$@"
