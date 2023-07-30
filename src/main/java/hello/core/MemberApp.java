package hello.core;

import hello.core.member.Grade;
import hello.core.member.MemberSerivceImpl;
import hello.core.member.MemberService;
import hello.core.member.Member;

public class MemberApp {
    public static void main(String[] args) {
        MemberService memberService = new MemberSerivceImpl();
        Member member = new Member(1L, "memberA", Grade.VIP);
        memberService.join(member);

        Member findMember = memberService.findMember(1L);
        System.out.println("new Member = " + member.getName());
        System.out.println("find Member = " + findMember.getName());
    }
}
